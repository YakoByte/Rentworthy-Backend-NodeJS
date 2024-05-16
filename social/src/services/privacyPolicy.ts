import PrivacyPolicyRepository from '../database/repository/privacyPolicy';
import { FormateData, FormateError } from '../utils';

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

            return FormateData (existingPrivacyPolicy);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Privacy Policy" });
        }
    }
   
    // get PrivacyPolicy
    async getPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            let existingPrivacyPolicy: any
                existingPrivacyPolicy = await this.repository.getPrivacyPolicy(PrivacyPolicyInputs);

            return FormateData(existingPrivacyPolicy);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Privacy Policy" });
        }
    }

    // add images to PrivacyPolicy
    async addImagesToPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.addImagesToPrivacyPolicy(
                PrivacyPolicyInputs
            );

            return FormateData(existingPrivacyPolicy);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image Privacy Policy" });
        }
    }

    // update PrivacyPolicy by id
    async updateById(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.updatePrivacyPolicyById(
                PrivacyPolicyInputs
            );

            return FormateData(existingPrivacyPolicy);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Privacy Policy" });
        }
    }

    // delete PrivacyPolicy by id  (soft delete)
    async deletePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyDeleteRequest) {
        try {
            const existingPrivacyPolicy: any = await this.repository.deletePrivacyPolicyById(
                PrivacyPolicyInputs
            );

            return FormateData(existingPrivacyPolicy);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Privacy Policy" });
        }
    }
}

export = PrivacyPolicyService;
