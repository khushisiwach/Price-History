import express from 'express';
import {addOrUpdateProduct , deleteProduct, getProducts} from "../controllers/productController.js";
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

router.post("/add" ,authMiddleware, addOrUpdateProduct);
router.get("/getAll",authMiddleware, getProducts);
router.delete("/delete/:id" , deleteProduct);


export default router;
