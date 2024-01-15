import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import {
  product,
  user,
  category,
  upload,
  renting,
  cancelBooking,
  // chatApi,
  payment,
  social,
} from "./gateway";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { Server as SocketIOServer } from 'socket.io'; // Renamed to prevent naming collision with http.Server
import { setupSocketServer } from './chat/chat';
import databaseConnection from "./database/connection";
const StartServer = async (): Promise<void> => {
  const app: Express = express();
  // Connect to the database
  try {
    await databaseConnection(); // Assuming this function returns a promise
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }

  app.get("/", (req: Request, res: Response) => {
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
  // app.use('/web/api/v1/chat', chatApi);
  // app.use('/app/api/v1/chat', chatApi);

  // 10mb limit for file upload
  app.use(express.json({ limit: "10mb" }));
  app.use(
    express.static(path.join(__dirname, "../../public"), {
      maxAge: "1d",
      etag: true,
      lastModified: true,
    })
  );
  app.set("uploads", path.join(__dirname, "../../public"));

  // server listening


  // Create a Socket.IO instance on top of the HTTP server
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Be cautious with this in production
    }
  });
  setupSocketServer(io);
  console.log("Socket server created")
  // io.on("connection", (socket) => {
  //   console.log("Socket connected");
  //   socket.on("createRoom", (userData) => {
  //     socket.join(userData.id);
  //     socket.emit("connected");
  //   });
  //   socket.on("joinRoom", (room) => {
  //     socket.join(room);
  //   });
  //   socket.on("leaveRoom", (room) => {
  //     socket.leave(room);
  //   });
  // });
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
  // .on("error", (err) => {
  //   console.log(err);
  //   process.exit(1);
  // });
};

// StartServer();



StartServer().catch(error => {
  console.error('Failed to start the server:', error);
});
