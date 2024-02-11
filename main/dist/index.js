"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const gateway_1 = require("./gateway");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const chat_1 = require("./chat/chat");
const database_1 = require("./database");
const sharedKey_1 = require("./middlewares/sharedKey");
const StartServer = async () => {
    // check if uploads folder exists
    const fs = require("fs");
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const app = (0, express_1.default)();
    try {
        // Connect to the database
        await (0, database_1.connectDB)();
        // validator
        app.use(sharedKey_1.ValidateKey);
        // Use Helmet!
        app.use((0, helmet_1.default)());
        // app.use(express.json({ limit: "10mb" }));
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
        app.use("/web/api/v1/subscription", gateway_1.subscription);
        app.use("/app/api/v1/subscription", gateway_1.subscription);
        const imagesDirectory = path_1.default.join(__dirname, "../../public/images");
        // Check if the directory exists, and create it if not
        if (!fs.existsSync(imagesDirectory)) {
            fs.mkdirSync(imagesDirectory, { recursive: true });
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
StartServer().catch((error) => {
    console.error("Failed to start the server:", error);
});
