import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";

import { PORT } from "./config";
import {
  product,
  user,
  category,
  upload,
  renting,
  cancelBooking,
  payment,
  social,
  subscription,
  chatApi,
} from "./localhostgateway";

import { setupSocketServer } from "./chat/chat";
import { connectDB } from "./database";
import { ValidateKey } from "./middlewares/sharedKey";

const StartServer = async (): Promise<void> => {
  try {
    // Connect to the database
    await connectDB();

    const app: Express = express();

    // check if uploads folder exists
    const fs = require("fs");
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Middleware
    app.use(helmet());
    app.use(cors());
    // app.use(express.json());
    app.use(ValidateKey);

    // Serve static files
    const imagesDirectory = path.join(__dirname, "../../public/images");
    app.use(express.static(imagesDirectory, {
      maxAge: "1d",
      etag: true,
      lastModified: true,
    }));
    app.set("uploads", imagesDirectory);

    // Routes
    app.get("/", (req, res) => {
      res.status(200).send({ message: "Microservices called........" });
    });
    app.use("/app/api/v1/user", user);
    app.use("/web/api/v1/user", user);
    app.use("/web/api/v1/category", category);
    app.use("/app/api/v1/category", category);
    app.use("/web/api/v1/upload", upload);
    app.use("/app/api/v1/upload", upload);
    app.use("/web/api/v1/product", product);
    app.use("/app/api/v1/product", product);
    app.use("/web/api/v1/renting", renting);
    app.use("/app/api/v1/renting", renting);
    app.use("/web/api/v1/chat", chatApi);
    app.use("/app/api/v1/chat", chatApi);
    app.use("/web/api/v1/payment", payment);
    app.use("/app/api/v1/payment", payment);
    app.use("/web/api/v1/social", social);
    app.use("/app/api/v1/social", social);
    app.use("/web/api/v1/cancel-booking", cancelBooking);
    app.use("/app/api/v1/cancel-booking", cancelBooking);
    app.use("/web/api/v1/subscription", subscription);
    app.use("/app/api/v1/subscription", subscription);

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO server
    const io = new SocketIOServer(server, {
      cors: {
        origin: '*', 
      }
    });
    setupSocketServer(io);

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit with error code
  }
};

StartServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1); // Exit with error code
});
