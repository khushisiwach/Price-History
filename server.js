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

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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