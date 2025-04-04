import express from 'express';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';
import { exportTaskReport, exportUserReport } from '../controllers/reportControllers.js';
const router = express.Router();

// Report Routes
router.get("/export/tasks", protect, adminOnly, exportTaskReport); // Export all tasks as Excel/DPF
router.get("/export/users", protect, adminOnly, exportUserReport); // Export all user-task report

export default router;