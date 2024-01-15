"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const gateway_1 = require("./gateway");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io"); // Renamed to prevent naming collision with http.Server
const chat_1 = require("./chat/chat");
const connection_1 = __importDefault(require("./database/connection"));
const StartServer = async () => {
    const app = (0, express_1.default)();
    // Connect to the database
    try {
        await (0, connection_1.default)(); // Assuming this function returns a promise
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
    app.get("/", (req, res) => {
        res.status(200).send({ message: "Microservices called........" });
    });
    // Use the reverse proxy server defined in the gateway module
    app.use("/app/api/v1/user", gateway_1.user);
    app.use("/web/api/v1/user", gateway_1.user);
    app.use("/web/api/v1/category", gateway_1.category);
    app.use("/app/api/v1/category", gateway_1.category);
    app.use("/web/api/v1/upload", gateway_1.upload);
    app.use("/app/api/v1/upload", gateway_1.upload);
    app.use("/web/api/v1/product", gateway_1.product);
    app.use("/app/api/v1/product", gateway_1.product);
    app.use("/web/api/v1/renting", gateway_1.renting);
    app.use("/app/api/v1/renting", gateway_1.renting);
    app.use("/web/api/v1/payment", gateway_1.payment);
    app.use("/app/api/v1/payment", gateway_1.payment);
    app.use("/web/api/v1/social", gateway_1.social);
    app.use("/app/api/v1/social", gateway_1.social);
    app.use("/web/api/v1/cancel-booking", gateway_1.cancelBooking);
    app.use("/app/api/v1/cancel-booking", gateway_1.cancelBooking);
    app.use('/web/api/v1/chat', gateway_1.chatApi);
    app.use('/app/api/v1/chat', gateway_1.chatApi);
    // 10mb limit for file upload
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../public"), {
        maxAge: "1d",
        etag: true,
        lastModified: true,
    }));
    app.set("uploads", path_1.default.join(__dirname, "../../public"));
    // server listening
    // Create a Socket.IO instance on top of the HTTP server
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // Be cautious with this in production
        }
    });
    (0, chat_1.setupSocketServer)(io);
    console.log("Socket server created");
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
    server.listen(config_1.PORT, () => {
        console.log(`Listening on port ${config_1.PORT}`);
    });
    // .on("error", (err) => {
    //   console.log(err);
    //   process.exit(1);
    // });
};
// StartServer();
StartServer().catch(error => {
    console.error('Failed to start the server:', error);
});
