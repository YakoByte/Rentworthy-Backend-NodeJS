import SubscribedUserRepository from '../database/repository/subscribedUser';
import { FormateData, FormateError } from '../utils';

import { SubscribedUserRequest, SubscribedUserUpdateRequest, SubscribedUserGetRequest, SubscribedUserDeleteRequest } from '../interface/subscribedUser';

// All Business logic will be here
class SubscribedUserService {
    private repository: SubscribedUserRepository;

    constructor() {
        this.repository = new SubscribedUserRepository();
    }

    // create SubscribedUser
    async CreateSubscribedUser(SubscribedUserInputs: SubscribedUserRequest) {
        try {
            const existingSubscribedUser: any = await this.repository.CreateSubscribedUser(
                SubscribedUserInputs
            );

            return FormateData(existingSubscribedUser);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create SubscribedUser" });
        }
    }

    // get SubscribedUsers by id
    async getSubscribedUserById(SubscribedUserInputs: SubscribedUserGetRequest) {
        try {
            let existingSubscribedUsers = await this.repository.getSubscribedUserById(
                SubscribedUserInputs
            );

            return FormateData(existingSubscribedUsers);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get SubscribedUser" });
        }
    }

    // get All SubscribedUsers
    async getAllSubscribedUser(SubscribedUserInputs: SubscribedUserGetRequest) {
        try {
            let existingSubscribedUsers: any
            existingSubscribedUsers = await this.repository.getAllSubscribedUser();

            return FormateData(existingSubscribedUsers);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get all SubscribedUser" });
        }
    }

    // get SubscribedUsers by id
    async getSubscribedUser(SubscribedUserInputs: SubscribedUserGetRequest) {
        try {
            let existingSubscribedUsers: any
            existingSubscribedUsers = await this.repository.getSubscribedUser(
                SubscribedUserInputs
            );

            return FormateData(existingSubscribedUsers);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get SubscribedUser" });
        }
    }

    // update SubscribedUser by id
    async updateById(SubscribedUserInputs: SubscribedUserUpdateRequest) {
        try {
            const existingSubscribedUser: any = await this.repository.updateSubscribedUserById(
                SubscribedUserInputs
            );

            return FormateData(existingSubscribedUser);
        } catch (err: any) {
            return FormateError({ error: "Failed to update SubscribedUser" });
        }
    }

    // delete SubscribedUser by id  (soft delete)
    async deleteSubscribedUser(SubscribedUserInputs: SubscribedUserDeleteRequest) {
        try {
            const existingSubscribedUser: any = await this.repository.deleteSubscribedUserById(
                SubscribedUserInputs
            );

            return FormateData(existingSubscribedUser);
        } catch (err: any) {
            return FormateError({ error: "Failed to delete SubscribedUser" });
        }
    }
}

export = SubscribedUserService;
