import roomRepository from '../database/repository/room';
import { FormateData, FormateError } from '../utils';

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
            return FormateError({ error: "Data not Created" });
        }
    }

    // get room
    async GetRoom(roomInputs: getRoomRequest) {
        try {
            const existingRoom: any = await this.repository.GetRoom(roomInputs);
            return existingRoom;
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    // get rooms
    async GetRooms(roomInputs: roomRequest) {
        try {
            const existingRoom: any = await this.repository.GetRooms(roomInputs);
            return existingRoom;
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    // delete room
    async DeleteRoom(roomInputs: deleteRoomRequest) {
        try {
            const existingRoom: any = await this.repository.DeleteRoom(roomInputs);
            return FormateData(existingRoom);
        } catch (err: any) {
            return FormateError({ error: "Data not Deleted" });
        }
    }
}

export = roomService;
