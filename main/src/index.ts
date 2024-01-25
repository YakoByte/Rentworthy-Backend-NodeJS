import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import { product, user, category, upload, renting, cancelBooking, payment, social } from "./gateway";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from 'socket.io'; 
import { setupSocketServer } from './chat/chat';
import { connectDB } from "./database";

const StartServer = async (): Promise<void> => {
  const app: Express = express();
  
  try {
    // Connect to the database
    await connectDB();

    // app.use(express.json({ limit: "10mb" }));

    app.get('/', (req, res) => {
      res.status(200).send({ message: "Microservices called........" });
    });

    // Use the reverse proxy server defined in the gateway module
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
    app.use("/web/api/v1/payment", payment);
    app.use("/app/api/v1/payment", payment);
    app.use("/web/api/v1/social", social);
    app.use("/app/api/v1/social", social);
    app.use("/web/api/v1/cancel-booking", cancelBooking);
    app.use("/app/api/v1/cancel-booking", cancelBooking);

    app.use(
      express.static(path.join(__dirname, "../../public"), {
        maxAge: "1d",
        etag: true,
        lastModified: true,
      })
    );
    app.set("uploads", path.join(__dirname, "../../public"));

    const server = http.createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        credentials: true
      }
    });
    setupSocketServer(io);
    console.log("Socket server created")

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

// Uncomment the line below if you want to call StartServer directly
// StartServer();
StartServer().catch(error => {
  console.error('Failed to start the server:', error);
});