import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import {
  product,
  user,
  category,
  upload,
  renting,
  chat,
  payment,
  social,
} from "./gateway";
import path from "path";
import { Server } from "socket.io";

const StartServer = async (): Promise<void> => {
  const app: Express = express();

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
  app.use('/web/api/v1/chat', chat);
  app.use('/app/api/v1/chat', chat);

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
  const server = app
    .listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });

  // Create a Socket.IO instance on top of the HTTP server
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.on("createRoom", (userData) => {
      socket.join(userData.id);
      socket.emit("connected");
    });
    socket.on("joinRoom", (room) => {
      socket.join(room);
    });
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
    });
  });
};

StartServer();
