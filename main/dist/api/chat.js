"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("../services/messages"));
const room_1 = __importDefault(require("../services/room"));
const auth_1 = __importDefault(require("../middlewares/auth"));
exports.default = (app) => {
    const chatService = new room_1.default();
    const messageService = new messages_1.default();
    // API = create room Id
    app.post('/create-rooms', auth_1.default, async (req, res, next) => {
        try {
            req.body.userId = req.user._id;
            const data = await chatService.CreateRoom(req.body);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
    // API = get room Id
    app.get('/get-rooms', auth_1.default, async (req, res, next) => {
        try {
            req.query.userId = req.user._id;
            const data = await chatService.GetRoom(req.query);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/create-message', auth_1.default, async (req, res, next) => {
        try {
            req.body.senderId = req.user._id;
            const data = await messageService.CreateMessage(req.body);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
    // API = get room Id
    app.get('/get-message', auth_1.default, async (req, res, next) => {
        try {
            req.query.userId = req.user._id;
            const data = await messageService.GetMessage(req.query);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
};
