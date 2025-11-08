import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";


const router = express.Router();

router.post("/register" , userController.registerUser);
router.post("/login" , userController.loginUser);
router.get("/profile" , authMiddleware , userController.getUserProfile);


export default router;