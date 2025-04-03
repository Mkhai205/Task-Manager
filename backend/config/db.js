import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;