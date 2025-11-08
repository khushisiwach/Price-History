import Product from "../models/product.js";
import { amazonScrapeProduct } from "../scrapers/amazonScraper.js";
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

export const addOrUpdateProduct = async(req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL:', url);
    
    if (!url) {
      return res.status(400).json({ error: "Product URL is required" });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    console.log('Starting to scrape product...');
    const scrapedData = await scrapeProduct(url);
    console.log('Scraped data:', scrapedData);

    if (!scrapedData.name) {
      return res.status(400).json({ error: "Could not extract product information. Please check if the URL is correct and accessible." });
    }

    const platform = getPlatform(url);
    const cleanUrl = platform === "amazon" ? cleanAmazonUrl(url) : cleanFlipkartUrl(url);
    
    let product = await Product.findOne({ url: cleanUrl, user: req.user._id });
    console.log('Existing product found:', !!product);

    if (!product) {
      product = new Product({
        name: scrapedData.name,
        url: cleanUrl,
        currentPrice: scrapedData.price,
        previousPrice: 0,
        image: scrapedData.image,
        priceHistory: [{ price: scrapedData.price }],
        user: req.user._id,
        recommendation: getRecommendation([{ price: scrapedData.price }], scrapedData.price) 
      });
      console.log('Created new product');
    } else {
      if (product.currentPrice !== scrapedData.price) {
        product.previousPrice = product.currentPrice;
        product.currentPrice = scrapedData.price;
        product.priceHistory.push({ price: scrapedData.price });
        console.log('Updated existing product with new price');
      } else {
        console.log('Price unchanged, no update needed');
      }
      // Update recommendation whenever price changes
      product.recommendation = getRecommendation(product.priceHistory, product.currentPrice);
    }

    await product.save();
    console.log('Product saved successfully');
    res.status(200).json(product);

  } catch (err) {
    console.error('Product controller error:', err);
    
    // Provide specific error messages based on error type
    if (err.message.includes("Unsupported platform")) {
      return res.status(400).json({ error: "Unsupported platform. Please use Amazon India or Flipkart URLs." });
    } else if (err.message.includes("Failed to scrape")) {
      return res.status(400).json({ error: "Unable to fetch product details. The product page might be unavailable or the URL format has changed." });
    } else if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Invalid product data. Please try again with a different URL." });
    } else {
      return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  }
}

// Get all products with recommendation
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });

    // Ensure recommendation is up-to-date
    const productsWithRecommendation = products.map(product => {
      return {
        ...product._doc, 
        recommendation: getRecommendation(product.priceHistory, product.currentPrice)
      };
    });

    res.status(200).json(productsWithRecommendation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get products" });
  }
};
