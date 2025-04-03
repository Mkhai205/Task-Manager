import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authControllers.js';



const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login a user
router.get("profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

export default router;