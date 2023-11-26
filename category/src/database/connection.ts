import mongoose from "mongoose";
import { DATABASE } from "../config";

const databaseConnection = async (): Promise<void> => {
  try {
    // Connect to MongoDB without the useNewUrlParser and useUnifiedTopology options
    await mongoose.connect(DATABASE);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default databaseConnection;

// import mongoose, { ConnectOptions } from "mongoose";
// import { DATABASE } from "../config";

// // interface MongooseConnectionOptions {
// //     useNewUrlParser: boolean;
// //     useUnifiedTopology: boolean;
// // }

// const mongooseOptions: ConnectOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// const databaseConnection = async (): Promise<void> => {
//   try {
//     await mongoose.connect(DATABASE, mongooseOptions);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// };

// export default databaseConnection;
