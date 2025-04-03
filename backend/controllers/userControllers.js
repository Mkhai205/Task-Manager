import User from "../models/User.js";
import Task from "../models/Task.js";
import { sendResponse } from "../utils/responseHelper.js";

// @desc  Get all users (Admin only)
// @route GET /api/users
// @access Private (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password"); // Exclude password field

        // Add task counts to each user
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                });

                return {
                    ...user._doc, // Convert Mongoose document to plain object
                    taskCounts: {
                        pending: pendingTasks,
                        inProgress: inProgressTasks,
                        completed: completedTasks,
                    },
                };
            })
        );

        return sendResponse(res, 200, true, "Users retrieved successfully", usersWithTaskCounts);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};

// @desc  Get user by ID
// @route GET /api/users/:id
// @access Private (Admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password field

        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        return sendResponse(res, 200, true, "User retrieved successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, "Server error", error.message);
    }
};


export { getUsers, getUserById };
