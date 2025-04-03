import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// desc   Register a new user
// route  POST /api/auth/register
// access Public
const registerUser = async (req, res) => {};

// desc   Login a user
// route  POST /api/auth/login
// access Public
const loginUser = async (req, res) => {};

// desc   Get user profile
// route  GET /api/auth/profile
// access Private (Required JWT token)
const getUserProfile = async (req, res) => {};

// desc   Update user profile
// route  PUT /api/auth/profile
// access Private (Required JWT token)
const updateUserProfile = async (req, res) => {};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
