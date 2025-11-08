import express from 'express';
import {addOrUpdateProduct , getProducts} from "../controllers/productController.js";
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

router.post("/add" ,authMiddleware, addOrUpdateProduct);

router.get("/getAll",authMiddleware, getProducts);


export default router;
