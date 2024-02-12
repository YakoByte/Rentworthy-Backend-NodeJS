"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const gateway_1 = require("./gateway");
const chat_1 = require("./chat/chat");
const database_1 = require("./database");
const sharedKey_1 = require("./middlewares/sharedKey");
const StartServer = async () => {
    try {
        // Connect to the database
        await (0, database_1.connectDB)();
        const app = (0, express_1.default)();
        // check if uploads folder exists
        const fs = require("fs");
        const dir = "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        // Middleware
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)());
        // app.use(express.json());
        app.use(sharedKey_1.ValidateKey);
        // Serve static files
        const imagesDirectory = path_1.default.join(__dirname, "../../public/images");
        app.use(express_1.default.static(imagesDirectory, {
            maxAge: "1d",
            etag: true,
            lastModified: true,
        }));
        app.set("uploads", imagesDirectory);
        // Routes
        app.get("/", (req, res) => {
            res.status(200).send({ message: "Microservices called........" });
        });
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
        // Create HTTP server
        const server = http_1.default.createServer(app);
        // Initialize Socket.IO server
        const io = new socket_io_1.Server(server);
        (0, chat_1.setupSocketServer)(io);
        server.listen(config_1.PORT, () => {
            console.log(`Listening on port ${config_1.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit with error code
    }
};
StartServer().catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit with error code
});
