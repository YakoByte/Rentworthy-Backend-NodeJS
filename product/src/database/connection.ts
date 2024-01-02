import mongoose from "mongoose";
import { DATABASE } from "../config";

const databaseConnection = async (): Promise<void> => {
  try {
    // Connect to MongoDB without the useNewUrlParser and useUnifiedTopology options
    await mongoose.connect("mongodb+srv://ecommerce:rejoice123@cluster0.ooqoe24.mongodb.net/rent?retryWrites=true&w=majority");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default databaseConnection;
