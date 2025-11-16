import puppeteer from "puppeteer";


export async function amazonScrapeProduct(url) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 800 });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    async function getText(selector) {
      try {
        const el = await page.$(selector);
        return el ? await page.evaluate((e) => e.innerText.trim(), el) : "";
      } catch {
        return "";
      }
    }

    async function getImage(selector) {
      try {
        const el = await page.$(selector);
        return el ? await page.evaluate((e) => e.src || e.getAttribute("data-old-hires") || "", el) : "";
      } catch {
        return "";
      }
    }

    const nameSelector = "#productTitle";
    const pricePrimary = ".a-price-whole";
    const imageSelector = "#imgTagWrapperId img";

    let name = await getText(nameSelector);
    if (!name) name = await getText("h1");

    let priceString = await getText(pricePrimary);
    if (!priceString) {
      priceString = await getText(".a-price .a-offscreen") || (await getText("#priceblock_ourprice")) || (await getText("#priceblock_dealprice"));
    }


    let price = 0;
    if (priceString) {
      const cleaned = priceString.replace(/[₹,\s]/g, "");
      const m = cleaned.match(/[0-9]+\.?[0-9]*/);
      if (m) price = parseFloat(m[0]);
    }

    if (!price) {
      const alt = await getText('.a-offscreen') || await getText('[data-a-size="l"] .a-offscreen');
      if (alt) {
        const cleaned = alt.replace(/[₹,\s]/g, "");
        const m = cleaned.match(/[0-9]+\.?[0-9]*/);
        if (m) price = parseFloat(m[0]);
      }
    }

    let image = await getImage(imageSelector);
    if (!image) image = await getImage("#landingImage") || "";

    await browser.close();
    return { name, price, image };
  } catch (err) {
    await browser.close();
    console.error("amazonScrapeProduct error:", err.message || err);
    throw err;
  }
}
