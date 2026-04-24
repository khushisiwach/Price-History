import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import  userRoutes from "./routes/authRoutes.js";
import  productRoutes from "./routes/productRoutes.js";


config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, 'public');
const clientIndexPath = path.join(clientBuildPath, 'index.html');

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

if (existsSync(clientIndexPath)) {
    app.use(express.static(clientBuildPath));
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(clientIndexPath);
    });
}


app.get("/" , (req,res) => {
    res.send("running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER is running on ${PORT} 🌨️ `);
})

connectDB();
await import("./cron/priceUpdater.js");