import User from "../models/User.js";
import { sendResponse } from "../utils/responseHelper.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import "dotenv/config";

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        //Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendResponse(res, 400, false, "User already exists");
        }

        // Determine user role: Admin if correct is provided, otherwise Member
        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // Respond with user data and token
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken({ id: user._id }),
        };

        return sendResponse(res, 201, true, "User registered successfully", userData);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

// @desc   Login a user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, false, "User not found");
        }

        // Compare password
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return sendResponse(res, 400, false, "Invalid password");
        }

        // Return user data and token
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken({ id: user._id }),
        };

        return sendResponse(res, 200, true, "Login successful", userData);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private (Required JWT token)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        return sendResponse(res, 200, true, "User profile retrieved successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private (Required JWT token)
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body;

        // Find user and update
        const user = await User.findById(req.user._id);

        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Update fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;

        if (password) {
            user.password = await hashPassword(password);
        }

        await user.save();

        return sendResponse(res, 200, true, "User profile updated successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

// @desc  Upload profile image
// @route  POST /api/auth/upload-image
// @access Private (Required JWT token)
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return sendResponse(res, 400, false, "No file uploaded");
        }

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Construct the image URL

        const user = await User.findById(req.user._id);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Update profile image URL
        user.profileImageUrl = imageUrl;
        await user.save();

        // Return updated user data
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
        };

        return sendResponse(res, 200, true, "Profile image uploaded successfully", userData);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfileImage };
