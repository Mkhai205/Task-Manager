import "dotenv/config";
import cors from "cors";

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

const corsConfig = cors(corsOptions);

export default corsConfig;