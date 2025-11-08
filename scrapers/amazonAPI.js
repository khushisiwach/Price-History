import axios from 'axios';
import * as cheerio from 'cheerio';

// Fallback Amazon scraper using HTTP requests instead of Puppeteer
export async function scrapeAmazonWithHTTP(url) {
  try {
    console.log('Trying HTTP-based scraping for:', url);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await axios.get(url, { 
      headers,
      timeout: 10000,
      maxRedirects: 3
    });

    const $ = cheerio.load(response.data);
    
    // Try multiple selectors for name
    let name = '';
    const nameSelectors = [
      '#productTitle',
      '.product-title',
      'h1[data-automation-id="product-title"]',
      '.a-size-large.product-title-word-break',
      'span#productTitle'
    ];

    for (const selector of nameSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim()) {
        name = element.text().trim();
        break;
      }
    }

    // Try multiple selectors for price
    let price = 0;
    const priceSelectors = [
      '.a-price .a-offscreen',
      '.a-price-whole',
      '.a-price-range .a-offscreen',
      '.a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen',
      '.a-price.a-text-price .a-offscreen',
      'span.a-price-symbol + span.a-price-whole',
      '.a-price-current .a-offscreen'
    ];

    for (const selector of priceSelectors) {
      const element = $(selector);
      if (element.length) {
        const priceText = element.text().trim();
        if (priceText) {
          const cleanPrice = priceText.replace(/[₹,\s]/g, "").match(/[\d.]+/);
          if (cleanPrice) {
            price = parseFloat(cleanPrice[0]);
            break;
          }
        }
      }
    }

    // Try multiple selectors for image
    let image = '';
    const imageSelectors = [
      '#imgTagWrapperId img',
      '#landingImage',
      '.a-dynamic-image',
      'img[data-old-hires]',
      '#main-image',
      '.a-dynamic-image.a-stretch-horizontal'
    ];

    for (const selector of imageSelectors) {
      const element = $(selector);
      if (element.length) {
        const src = element.attr('src') || element.attr('data-old-hires') || element.attr('data-a-dynamic-image');
        if (src && src.startsWith('http')) {
          image = src;
          break;
        }
      }
    }

    console.log('HTTP Scraping results:', { 
      name: name ? name.substring(0, 50) + '...' : 'Not found',
      price,
      imageFound: !!image
    });

    return { name, price, image };

  } catch (error) {
    console.error('HTTP scraping error:', error.message);
    throw new Error(`HTTP scraping failed: ${error.message}`);
  }
}