import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/product.js';

dotenv.config();

async function migrate() {
  await connectDB();
  console.log('Connected to DB for migration');

  const products = await Product.find();
  console.log(`Found ${products.length} products`);

  let updatedCount = 0;

  for (const product of products) {
    let changed = false;

    // Normalize priceHistory entries
    const normalizedHistory = (product.priceHistory || []).map((ph) => {
      const entry = { ...ph._doc || ph };

      // Support multiple legacy fields: date, Date, createdAt
      const raw = entry.date || entry.Date || entry.createdAt || null;
      if (!raw) {
        entry.date = new Date();
        changed = true;
      } else {
        const d = new Date(raw);
        if (isNaN(d.getTime())) {
          entry.date = new Date();
          changed = true;
        } else if (entry.date == null || entry.date === entry.Date) {
          entry.date = d;
          changed = true;
        } else {
          entry.date = d;
        }
      }

      // Ensure price is a number
      entry.price = Number(entry.price) || 0;

      return entry;
    });

    // If previousPrice is missing or zero and we have >=2 history entries, set it
    const sorted = normalizedHistory.slice().sort((a,b) => new Date(a.date) - new Date(b.date));
    if ((!product.previousPrice || product.previousPrice === 0) && sorted.length >= 2) {
      const secondLast = sorted[sorted.length - 2];
      if (secondLast && typeof secondLast.price === 'number') {
        product.previousPrice = secondLast.price;
        changed = true;
      }
    }

    // Replace product.priceHistory with normalized Date objects
    product.priceHistory = normalizedHistory;

    if (changed) {
      await product.save();
      updatedCount++;
      console.log(`Updated product ${product._id}`);
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} products.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
