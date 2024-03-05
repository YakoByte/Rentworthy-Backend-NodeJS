"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../services/room"));
exports.default = (app) => {
    const service = new room_1.default();
    // API = create room Id
    app.post('/create-rooms', async (req, res, next) => {
        try {
            const data = await service.CreateRoom(req.body);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
    // API = get room Id
    app.get('/get-rooms', async (req, res, next) => {
        try {
            const data = await service.GetRoom(req.query);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    });
};
