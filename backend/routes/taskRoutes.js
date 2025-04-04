import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
    createTask,
    deleteTask,
    getDashboardData,
    getTaskById,
    getTasks,
    getUserDashboardData,
    updateTask,
    updateTaskChecklist,
    updateTaskStatus,
} from "../controllers/taskControllers.js";

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, createTask); // Create a new task (Admin only)
router.put("/:id", protect, updateTask); // Update a task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

export default router;
