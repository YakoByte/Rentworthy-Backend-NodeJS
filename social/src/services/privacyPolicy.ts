import PrivacyPolicyRepository from '../database/repository/privacyPolicy';
import { FormateData } from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { privacyPolicyRequest, privacyPolicyUpdateRequest, privacyPolicyGetRequest, privacyPolicyDeleteRequest } from '../interface/privacyPolicy';

// All Business logic will be here
class PrivacyPolicyService {
    private repository: PrivacyPolicyRepository;

    constructor() {
        this.repository = new PrivacyPolicyRepository();
    }
    // create PrivacyPolicy
    async CreatePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyRequest) {
        try {
            console.log("PrivacyPolicyInputs", PrivacyPolicyInputs)
            const existingPrivacyPolicy: any = await this.repository.CreatePrivacyPolicy(
                PrivacyPolicyInputs
            );

            return FormateData ({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err.message)
            return ({ message: "Data Not found", err });
        }
    }
    // get PrivacyPolicy by id
    async getPrivacyPolicyById(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            let existingPrivacyPolicy = await this.repository.getPrivacyPolicyById(
                PrivacyPolicyInputs
            );

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get All PrivacyPolicy
    async getAllPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            let existingPrivacyPolicy: any
            existingPrivacyPolicy = await this.repository.getAllPrivacyPolicy();

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get PrivacyPolicy by id
    async getPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            let existingPrivacyPolicy: any
            existingPrivacyPolicy = await this.repository.getPrivacyPolicy(
                PrivacyPolicyInputs
            );

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to PrivacyPolicy
    async addImagesToPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.addImagesToPrivacyPolicy(
                PrivacyPolicyInputs
            );

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update PrivacyPolicy by id
    async updateById(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.updatePrivacyPolicyById(
                PrivacyPolicyInputs
            );

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete PrivacyPolicy by id  (soft delete)
    async deletePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyDeleteRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.deletePrivacyPolicyById(
                PrivacyPolicyInputs
            );

            return FormateData({ existingPrivacyPolicy });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = PrivacyPolicyService;
