import TermConditionRepository from '../database/repository/termCondition';
import { FormateData, FormateError } from '../utils';

import { termConditionRequest, termConditionUpdateRequest, termConditionGetRequest, termConditionDeleteRequest } from '../interface/termCondition';

// All Business logic will be here
class TermConditionService {
    private repository: TermConditionRepository;

    constructor() {
        this.repository = new TermConditionRepository();
    }
    // create TermCondition
    async CreateTermCondition(TermConditionInputs: termConditionRequest) {
        try {
            console.log("TermConditionInputs", TermConditionInputs)
            const existingTermCondition: any = await this.repository.CreateTermCondition(
                TermConditionInputs
            );

            return FormateData (existingTermCondition);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Term & Condition" });
        }
    }

    // get TermConditions by id
    async getTermCondition(TermConditionInputs: termConditionGetRequest) {
        try {
            let existingTermConditions: any
            existingTermConditions = await this.repository.getTermCondition(
                TermConditionInputs
            );

            return FormateData(existingTermConditions);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Term & Condition" });
        }
    }

    // add images to TermCondition
    async addImagesToTermCondition(TermConditionInputs: termConditionUpdateRequest) {
        try {
            const existingTermCondition: any = await this.repository.addImagesToTermCondition(
                TermConditionInputs
            );

            return FormateData(existingTermCondition);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image Term & Condition" });
        }
    }

    // update TermCondition by id
    async updateById(TermConditionInputs: termConditionUpdateRequest) {
        try {
            const existingTermCondition: any = await this.repository.updateTermConditionById(
                TermConditionInputs
            );

            return FormateData(existingTermCondition);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Term & Condition" });
        }
    }

    // delete TermCondition by id  (soft delete)
    async deleteTermCondition(TermConditionInputs: termConditionDeleteRequest) {
        try {
            const existingTermCondition: any = await this.repository.deleteTermConditionById(
                TermConditionInputs
            );

            return FormateData(existingTermCondition);
        } catch (err: any) {
            return FormateError({ error: "Failed to delete Term & Condition" });
        }
    }
}

export = TermConditionService;
