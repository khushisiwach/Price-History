# 📈 Price History — React.js, Node.js, Express.js, MongoDB, Puppeteer, Cheerio

A full-stack web application that tracks product prices from e-commerce websites using web scraping, stores historical data, and visualizes price trends to help users make informed purchase decisions.

## 🚀 Features

### Core Functionality
- Automated Price Scraping: Fetch product prices from e-commerce sites using Puppeteer & Cheerio
- Historical Price Tracking: Store price data periodically for trend analysis
- Price Trend Visualization: Interactive charts showing price changes over time
- Search & Filter: Find products and view their price history easily
- Best Time to Buy: Analyze past trends to decide optimal purchase timing

### Technical Features
- Modern UI: Responsive React interface styled with Tailwind CSS
- RESTful API: Node.js + Express backend with clean endpoints
- Database Integration: MongoDB for storing product and price history
- Web Scraping Engine: Puppeteer for dynamic pages, Cheerio for parsing HTML
- Environment Config: `.env` for API keys and DB connection
- (Optional) Authentication for user-specific tracking

---
## 🧱 Project Structure
``` price-history/
├─ client/                      # React + Tailwind
│  ├─ src/
│  │  ├─ components/           # UI components (charts, tables, forms)
│  │  ├─ pages/                # Dashboard, Product Details, History
│  │  ├─ services/             # API calls (axios)
│  │  └─ App.jsx
│  ├─ index.html
│  └─ package.json
├─ server/                      # Node + Express
│  ├─ src/
│  │  ├─ models/               # Product & Price schemas
│  │  ├─ routes/               # /api/products, /api/history
│  │  ├─ controllers/          # Business logic for scraping & data
│  │  ├─ scraper/              # Puppeteer & Cheerio scripts
│  │  └─ index.js              # App entry point
│  ├─ package.json
├─ .env.example                 # Environment variables template
└─ README.md ```

## ▶️ Commands to Run the App

### **Backend (Express + MongoDB + Scraper)**
```bash
cd server
npm install
npm run dev   # Starts backend on http://localhost:5000

#Frontend (React + Tailwind)

cd client
npm install
npm run dev   # Starts frontend on http://localhost:5173
``

📡 API Endpoints
Products

GET /api/products → List all tracked products
POST /api/products → Add a new product to track

#Price History
GET /api/history/:productId → Get historical prices for a product

🧪 Usage

Add Products: Enter product URL to start tracking
Scrape Prices: Run scraper manually or set up cron job
View History: Check charts for historical price trends
Analyze Trends: Decide best time to buy based on data


🐛 Troubleshooting

Scraper blocked by site: Use rotating proxies or headless browser settings
MongoDB connection issues: Check MONGO_URI and Atlas IP whitelist
CORS errors: Enable CORS in Express middleware

🙏 Acknowledgments

Puppeteer & Cheerio for scraping
React & Tailwind for UI
MongoDB for data persistence

