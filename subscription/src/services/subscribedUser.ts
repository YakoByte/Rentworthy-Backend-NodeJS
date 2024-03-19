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
    async getSubscribedUser(SubscribedUserInputs: SubscribedUserGetRequest) {
        try {
            let existingSubscribedUsers: any
            if(SubscribedUserInputs._id){ 
                existingSubscribedUsers = await this.repository.getSubscribedUserById(SubscribedUserInputs);
            } else if(SubscribedUserInputs.userId) {
                existingSubscribedUsers = await this.repository.getSubscribedUserByUserId(SubscribedUserInputs)
            } else if(SubscribedUserInputs.paymentId) {
                existingSubscribedUsers = await this.repository.getSubscribedUserByPaymentId(SubscribedUserInputs);
            } else {
                existingSubscribedUsers = await this.repository.getAllSubscribedUser({
                    skip:
                      Number(SubscribedUserInputs.page) * Number(SubscribedUserInputs.limit) -
                        Number(SubscribedUserInputs.limit) || 0,
                    limit: Number(SubscribedUserInputs.limit) || 10,
                  });
            }

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
