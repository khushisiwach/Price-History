import cron from "node-cron";
import Product from "../models/product.js";
import { scrapeProduct } from "../scrapers/platformScraper.js";
import { getRecommendation } from "../utils/aiRecommendation.js";

cron.schedule("0 */6 * * *", async () => {
  // every 6 hours
  const products = await Product.find();
  for (const product of products) {
    const scraped = await scrapeProduct(product.url);
    if (scraped.price !== product.currentPrice) {
      product.previousPrice = product.currentPrice;
      product.currentPrice = scraped.price;
      product.priceHistory.push({ price: scraped.price });
      product.lastChecked = new Date();
      await product.save();
    }
    product.recommendation = getRecommendation(
      product.priceHistory,
      product.currentPrice
    );
    product.lastChecked = new Date();
    await product.save();
  }
  console.log("✅ Price history updated for all products");
});
