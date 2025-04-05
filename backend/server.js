import "dotenv/config";
import express from "express";
import corsConfig from "./config/cors.js";
import path from "path";
import { fileURLToPath } from "url"; // Import this to handle __dirname in ES modules
import connectDB from "./config/db.js";
import mainRouter from "./routes/mainRoutes.js";

const app = express();

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to handle CORS
app.use(corsConfig);

// Connect Database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

// Server uploads folder for static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});