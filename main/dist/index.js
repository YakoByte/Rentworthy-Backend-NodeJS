"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const newgateway_1 = require("./newgateway");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const chat_1 = require("./chat/chat");
const database_1 = require("./database");
const StartServer = async () => {
    const app = (0, express_1.default)();
    try {
        // Connect to the database
        await (0, database_1.connectDB)();
        // app.use(express.json({ limit: "10mb" }));
        app.get("/", (req, res) => {
            res.status(200).send({ message: "Microservices called........" });
        });
        // Use the reverse proxy server defined in the gateway module
        app.use("/app/api/v1/user", newgateway_1.user);
        app.use("/web/api/v1/user", newgateway_1.user);
        app.use("/web/api/v1/category", newgateway_1.category);
        app.use("/app/api/v1/category", newgateway_1.category);
        app.use("/web/api/v1/upload", newgateway_1.upload);
        app.use("/app/api/v1/upload", newgateway_1.upload);
        app.use("/web/api/v1/product", newgateway_1.product);
        app.use("/app/api/v1/product", newgateway_1.product);
        app.use("/web/api/v1/renting", newgateway_1.renting);
        app.use("/app/api/v1/renting", newgateway_1.renting);
        app.use("/web/api/v1/payment", newgateway_1.payment);
        app.use("/app/api/v1/payment", newgateway_1.payment);
        app.use("/web/api/v1/social", newgateway_1.social);
        app.use("/app/api/v1/social", newgateway_1.social);
        app.use("/web/api/v1/cancel-booking", newgateway_1.cancelBooking);
        app.use("/app/api/v1/cancel-booking", newgateway_1.cancelBooking);
        const imagesDirectory = path_1.default.join(__dirname, "../../public/images");
        // Check if the directory exists, and create it if not
        if (!fs_1.default.existsSync(imagesDirectory)) {
            fs_1.default.mkdirSync(imagesDirectory, { recursive: true });
        }
        app.use(express_1.default.static(path_1.default.join(__dirname, "../../public/images"), {
            maxAge: "1d",
            etag: true,
            lastModified: true,
        }));
        app.set("uploads", path_1.default.join(__dirname, "../../public/images"));
        const server = http_1.default.createServer(app);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
                credentials: true,
            },
        });
        (0, chat_1.setupSocketServer)(io);
        console.log("Socket server created");
        server.listen(config_1.PORT, () => {
            console.log(`Listening on port ${config_1.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start the server:", error);
    }
};
// Uncomment the line below if you want to call StartServer directly
// StartServer();
StartServer().catch((error) => {
    console.error("Failed to start the server:", error);
});
