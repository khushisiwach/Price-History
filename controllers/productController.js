import Product from "../models/product.js";
import { getPlatform, scrapeProduct } from "../scrapers/platformScraper.js";
import { getRecommendation } from "../utils/aiRecommendation.js";


function cleanAmazonUrl(url) {
  const match = url.match(/(https:\/\/www\.amazon\.in\/[^/]+\/dp\/[A-Z0-9]+)/);
  return match ? match[1] : url.split("?")[0].replace(/\/$/, "");
}

function cleanFlipkartUrl(url) {
  const match = url.match(/(https:\/\/www\.flipkart\.com\/[^/]+\/p\/[A-Za-z0-9]+)/);
  return match ? match[1] : url.split("?")[0].replace(/\/$/, "");
}
export const addOrUpdateProduct = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Product URL is required" });

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const scrapedData = await scrapeProduct(url);
    if (!scrapedData?.name) {
      return res.status(400).json({
        error: "Could not extract product info. Check if URL is correct.",
      });
    }
    const platform = getPlatform(url);
    const cleanUrl =
      platform === "amazon" ? cleanAmazonUrl(url) : cleanFlipkartUrl(url);

    let product = await Product.findOne({ url: cleanUrl, user: req.user._id });

    if (!product) {
      const newEntry = { price: scrapedData.price, date: new Date() };

      product = new Product({
        name: scrapedData.name,
        url: cleanUrl,
        currentPrice: scrapedData.price,
        previousPrice: 0,
        image: scrapedData.image,
        priceHistory: [newEntry],
        user: req.user._id,
        recommendation: getRecommendation([newEntry], scrapedData.price),
      });

    } else {
      const newEntry = { price: scrapedData.price, date: new Date() };

      if (product.currentPrice !== scrapedData.price) {
        product.previousPrice = product.currentPrice;
        product.currentPrice = scrapedData.price;
        product.priceHistory.push(newEntry);
      }

      product.recommendation = getRecommendation(
        product.priceHistory,
        product.currentPrice
      );
    }

    await product.save();
    res.status(200).json(product);

  } catch (error) {
    console.error("Add/Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });

    const result = products.map((p) => ({
      ...p._doc,
      recommendation: getRecommendation(p.priceHistory, p.currentPrice),
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to get products" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
