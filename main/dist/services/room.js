"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const room_1 = __importDefault(require("../database/repository/room"));
const utils_1 = require("../utils");
// All Business logic will be here
class roomService {
    repository;
    constructor() {
        this.repository = new room_1.default();
    }
    // create room
    async CreateRoom(roomInputs) {
        try {
            const existingRoom = await this.repository.CreateRoom(roomInputs);
            return existingRoom;
        }
        catch (err) {
            return (0, utils_1.FormateError)({ error: "Data not Created" });
        }
    }
    // get room
    async GetRoom(roomInputs) {
        try {
            const existingRoom = await this.repository.GetRoom(roomInputs);
            return existingRoom;
        }
        catch (err) {
            return (0, utils_1.FormateError)({ error: "Data not Found" });
        }
    }
    // get rooms
    async GetRooms(roomInputs) {
        try {
            const existingRoom = await this.repository.GetRooms(roomInputs);
            return existingRoom;
        }
        catch (err) {
            return (0, utils_1.FormateError)({ error: "Data not Found" });
        }
    }
    // delete room
    async DeleteRoom(roomInputs) {
        try {
            const existingRoom = await this.repository.DeleteRoom(roomInputs);
            return (0, utils_1.FormateData)(existingRoom);
        }
        catch (err) {
            return (0, utils_1.FormateError)({ error: "Data not Deleted" });
        }
    }
}
module.exports = roomService;
