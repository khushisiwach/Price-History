import cron from "node-cron";
import Product from "../models/product.js";
import { scrapeProduct } from "../scrapers/platformScraper.js";
import { getRecommendation } from "../utils/aiRecommendation.js";
// runs every 6 hours

cron.schedule("0 */6 * * *", async () => {
  console.log(" Running scheduled price update...");

  try {
    const products = await Product.find();

    for (const product of products) {
      try {
        const scraped = await scrapeProduct(product.url);
        const newPrice = scraped?.price;
        const oldPrice = product.currentPrice;

        if (typeof newPrice === "number" && newPrice !== oldPrice) {
          product.previousPrice = oldPrice;
          product.currentPrice = newPrice;

          product.priceHistory.push({
            price: newPrice,
            date: new Date(),
          });

          console.log(`Updated price for product ${product._id}`);
        }

        product.lastChecked = new Date();
        product.recommendation = getRecommendation(
          product.priceHistory,
          product.currentPrice
        );

        await product.save();
      } catch (err) {
        console.error(` Error updating product ${product._id}:`, err.message);
      }
    }

    console.log("Cron job completed successfully.");
  } catch (err) {
    console.error(" Cron job failed:", err.message);
  }
});

if (process.env.NODE_ENV !== "production") {
  (async () => {
    // console.log("Running immediate startup price update...");

    try {
      const products = await Product.find();

      for (const product of products) {
        try {
          const scraped = await scrapeProduct(product.url);
          const newPrice = scraped?.price;

          if (typeof newPrice === "number" && newPrice !== product.currentPrice) {
            product.previousPrice = product.currentPrice;
            product.currentPrice = newPrice;

            product.priceHistory.push({
              price: newPrice,
              date: new Date(),
            });
          }

          product.lastChecked = new Date();
          product.recommendation = getRecommendation(
            product.priceHistory,
            product.currentPrice
          );

          await product.save();
        } catch (err) {
          console.error(`Startup error for ${product._id}:`, err.message);
        }
      }

      console.log("Startup update complete.");
    } catch (err) {
      console.error("Startup update failed:", err.message);
    }
  })();
}