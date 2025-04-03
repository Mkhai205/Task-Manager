import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
// import taskRoutes from "./taskRoutes.js";
// import reportRoutes from "./reportRoutes.js";


const router = express.Router();

// Main Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// router.use("/tasks", taskRoutes);
// router.use("/reports", reportRoutes);

export default router;