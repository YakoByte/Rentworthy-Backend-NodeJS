import messageRepository from "../database/repository/messages";
import { FormateData, FormateError } from '../utils';

import { messageRequest, getMessageRequest, deleteMessageRequest } from '../interface/messages';

// All Business logic will be here
class messageService {
    private repository: messageRepository;

    constructor() {
        this.repository = new messageRepository();
    }

    // create message
    async CreateMessage(messageInputs: messageRequest) {
        try {
            const existingMessage: any = await this.repository.CreateMessage(messageInputs);
            return FormateData(existingMessage);
        } catch (err: any) {
            return FormateError({ error: "Data not Created" });
        }
    }

    // group message in multiple room
    async GroupMessage(messageInputs: any) {
        try {
            if (messageInputs.roomId && messageInputs.roomId.length > 0) {
                for (let i = 0; i < messageInputs.roomId.length; i++) {
                    let roomDetail: any =
                    {
                        roomId: messageInputs.roomId[i],
                        message: messageInputs.message,
                        senderId: messageInputs.senderId,
                        receiverId: messageInputs.receiverId,
                        messageType: messageInputs.messageType,
                    }
                    const existingMessage: any = await this.repository.GroupMessage(roomDetail);
                }
            }
            return FormateData({ message: "Message sent" });
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    // get message
    async GetMessage(messageInputs: getMessageRequest) {
        try {
            const existingMessage: any = await this.repository.GetMessage(messageInputs);
            return FormateData(existingMessage);
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    // get messages
    async GetMessages(messageInputs: messageRequest) {
        try {
            const existingMessage: any = await this.repository.GetMessages(messageInputs);
            return FormateData(existingMessage);
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    // delete message
    async DeleteMessage(messageInputs: deleteMessageRequest) {
        try {
            const existingMessage: any = await this.repository.DeleteMessage(messageInputs);
            return FormateData(existingMessage);
        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

}

export = messageService;
