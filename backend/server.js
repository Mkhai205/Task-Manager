import "dotenv/config";
import express from "express";
import corsConfig from "./config/cors.js";
import path from "path";
import connectDB from "./config/db.js";
import mainRouter from "./routes/mainRoutes.js";

const app = express();

// Middleware to handle CORS
app.use(corsConfig);

// Connect Database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
