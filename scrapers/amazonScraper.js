import puppeteer from "puppeteer";
import axios from "axios";
import * as cheerio from "cheerio";
import { getPlatform } from "./platformScraper.js";

const platformSelectors = {
  amazon: {
    name: ["#productTitle", ".product-title", "h1[data-automation-id='product-title']"],
    price: [
      ".a-price-whole", 
      ".a-price .a-offscreen", 
      ".a-price-range .a-offscreen",
      ".a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen",
      ".a-price.a-text-price .a-offscreen"
    ],
    image: [
      "#imgTagWrapperId img", 
      "#landingImage", 
      ".a-dynamic-image",
      "img[data-old-hires]"
    ],
  },
};

// HTTP-based fallback scraper
async function scrapeWithHTTP(url) {
  try {
    console.log('Trying HTTP-based scraping for:', url);
    
    // Set headers to mimic a real browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    };

    const response = await axios.get(url, {
      headers,
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    
    // Try different selectors for Amazon product title
    let name = $('#productTitle').text().trim();
    if (!name) name = $('[data-automation-id="product-title"]').text().trim();
    if (!name) name = $('.product-title').text().trim();
    if (!name) name = $('h1').first().text().trim();
    
    // Try different selectors for price
    let price = 0;
    const priceSelectors = [
      '.a-price-whole',
      '.a-price .a-offscreen',
      '[data-automation-id="product-price"] .a-price .a-offscreen',
      '.a-price-range .a-offscreen',
      '.price',
      '[class*="price"]'
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        const cleanPrice = priceText.replace(/[₹,\s]/g, "").match(/[\d.]+/);
        if (cleanPrice) {
          price = parseFloat(cleanPrice[0]);
          break;
        }
      }
    }

    // Try different selectors for image
    let image = $('[data-automation-id="hero-image"] img').attr('src');
    if (!image) image = $('#landingImage').attr('src');
    if (!image) image = $('.a-dynamic-image').first().attr('src');
    if (!image) image = $('img[src*="images-amazon"]').first().attr('src');

    console.log('HTTP Scraping result:', { name: name.substring(0, 50) + '...', price, imageFound: !!image });

    if (name && price > 0) {
      return { name, price, image: image || '' };
    }

    throw new Error('Could not extract product details with HTTP method');

  } catch (error) {
    console.error('HTTP scraping failed:', error.message);
    throw error;
  }
}

// 🔹 Main scraper function
export async function amazonScrapeProduct(url) {
  const platform = getPlatform(url);
  console.log('Scraping platform:', platform);
  
  if (platform !== "amazon") throw new Error("Unsupported Platform");

  const selectors = platformSelectors.amazon;
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: "new", // Use new headless mode
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=VizDisplayCompositor",
        "--disable-web-security",
        "--disable-features=site-per-process",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-backgrounding-occluded-windows"
      ],
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set more realistic headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1',
    });
    
    console.log('Navigating to URL:', url);
    
    // Try multiple navigation strategies
    try {
      await page.goto(url, { 
        waitUntil: "domcontentloaded",
        timeout: 20000 
      });
    } catch (timeoutError) {
      console.log('First navigation attempt timed out, trying with different strategy...');
      await page.goto(url, { 
        waitUntil: "load",
        timeout: 15000 
      });
    }

    // Wait for dynamic content and potential redirects
    console.log('Waiting for page content...');
    await page.waitForTimeout(3000);
    
    // Check if we got redirected or if page loaded properly
    const currentUrl = page.url();
    console.log('Current page URL:', currentUrl);
    
    // If redirected to a different domain, it might be blocked
    if (!currentUrl.includes('amazon.in')) {
      throw new Error('Page was redirected away from Amazon, possibly blocked');
    }

    // 🔹 Helper function to get text from multiple selectors
    async function getTextFromMultipleSelectors(selectorArray) {
      for (const selector of selectorArray) {
        try {
          const element = await page.$(selector);
          if (element) {
            const text = await page.evaluate(el => el.innerText?.trim() || el.textContent?.trim() || "", element);
            if (text) {
              console.log(`Found text with selector ${selector}: ${text}`);
              return text;
            }
          }
        } catch (error) {
          console.log(`Selector ${selector} failed:`, error.message);
        }
      }
      return "";
    }

    async function getImageFromMultipleSelectors(selectorArray) {
      for (const selector of selectorArray) {
        try {
          const element = await page.$(selector);
          if (element) {
            const src = await page.evaluate(el => el.src || el.getAttribute('data-old-hires') || el.getAttribute('data-a-dynamic-image'), element);
            if (src && src.startsWith('http')) {
              console.log(`Found image with selector ${selector}: ${src}`);
              return src;
            }
          }
        } catch (error) {
          console.log(`Image selector ${selector} failed:`, error.message);
        }
      }
      return "";
    }

    // 🔹 Extract product info
    console.log('Extracting product name...');
    const name = await getTextFromMultipleSelectors(selectors.name);
    
    console.log('Extracting product price...');
    const priceString = await getTextFromMultipleSelectors(selectors.price);
    
    console.log('Extracting product image...');
    const image = await getImageFromMultipleSelectors(selectors.image);

    // Parse price more robustly
    let price = 0;
    if (priceString) {
      const cleanPrice = priceString.replace(/[₹,\s]/g, "").match(/[\d.]+/);
      price = cleanPrice ? parseFloat(cleanPrice[0]) : 0;
    }

    console.log('Scraped data:', { name: name.substring(0, 50) + '...', price, imageFound: !!image });

    await browser.close();
    
    if (!name) {
      throw new Error("Could not extract product name. The page structure might have changed.");
    }
    
    return { name, price, image };
    
  } catch (error) {
    console.error('Puppeteer scraping failed:', error.message);
    if (browser) {
      await browser.close();
    }
    
    // Try HTTP-based fallback
    console.log('Attempting HTTP-based fallback scraping...');
    try {
      return await scrapeWithHTTP(url);
    } catch (httpError) {
      console.error('HTTP fallback also failed:', httpError.message);
      throw new Error(`Both Puppeteer and HTTP scraping failed. Puppeteer: ${error.message}. HTTP: ${httpError.message}`);
    }
  }
}
