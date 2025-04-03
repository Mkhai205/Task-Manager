import User from "../models/User.js";
import { sendResponse } from "../utils/responseHelper.js";
import { verifyToken } from "../utils/jwt.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract the token from the header
            const decoded = verifyToken(token);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            sendResponse(res, 401, false, "Not authorized, no token");
        }
    } catch (error) {
        sendResponse(res, 401, false, "Not authorized, token failed", error.message);
    }
};

// Middleware for Admin-only access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        sendResponse(res, 403, false, "Not authorized as an admin");
    }
};

export { protect, adminOnly };
