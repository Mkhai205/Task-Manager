import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
} from "../controllers/authControllers.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js"; // Import the upload middleware
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login a user
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

router.post("/upload-image", protect, uploadMiddleware, uploadProfileImage); // Upload profile image

export default router;
