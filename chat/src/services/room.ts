import roomRepository from '../database/repository/room';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { roomRequest, getRoomRequest, deleteRoomRequest } from '../interface/room';

// All Business logic will be here
class roomService {
    private repository: roomRepository;

    constructor() {
        this.repository = new roomRepository();
    }
    // create room
    async CreateRoom(roomInputs: roomRequest) {
        try {
            const existingRoom: any = await this.repository.CreateRoom(roomInputs);
            return existingRoom;
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // get room
    async GetRoom(roomInputs: getRoomRequest) {
        try {
            const existingRoom: any = await this.repository.GetRoom(roomInputs);
            return FormateData({ existingRoom });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // get rooms
    async GetRooms(roomInputs: roomRequest) {
        try {
            const existingRoom: any = await this.repository.GetRooms(roomInputs);
            return FormateData({ existingRoom });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // delete room
    async DeleteRoom(roomInputs: deleteRoomRequest) {
        try {
            const existingRoom: any = await this.repository.DeleteRoom(roomInputs);
            return FormateData({ existingRoom });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

}

export = roomService;
