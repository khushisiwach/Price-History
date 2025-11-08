import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import connectDB from "./config/db.js";
import  userRoutes from "./routes/authRoutes.js";
import  productRoutes from "./routes/productRoutes.js";
import "./cron/priceUpdater.js"


config();
connectDB();
const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Add your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use("/api/users" , userRoutes);
app.use("/api/product" , productRoutes);


app.get("/" , (req,res) => {
    res.send("running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER is running on ${PORT} 🌨️ `);
})