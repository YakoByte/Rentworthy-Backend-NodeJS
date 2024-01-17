import mongoose, { ConnectOptions } from "mongoose";
import { DATABASE } from "../config";



const databaseConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(DATABASE || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};



export default databaseConnection;
