import TermConditionRepository from '../database/repository/termCondition';
import { FormateData } from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

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

            return existingTermCondition;
        } catch (err: any) {
            console.log("err", err.message)
            return ({ message: "Data Not found", err });
        }
    }
    // get TermConditions by id
    async getTermConditionById(TermConditionInputs: termConditionGetRequest) {
        try {
            let existingTermConditions = await this.repository.getTermConditionById(
                TermConditionInputs
            );

            return FormateData({ existingTermConditions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get All TermConditions
    async getAllTermCondition(TermConditionInputs: termConditionGetRequest) {
        try {
            let existingTermConditions: any
            existingTermConditions = await this.repository.getAllTermCondition();

            return FormateData({ existingTermConditions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get TermConditions by id
    async getTermCondition(TermConditionInputs: termConditionGetRequest) {
        try {
            let existingTermConditions: any
            existingTermConditions = await this.repository.getTermCondition(
                TermConditionInputs
            );

            return FormateData({ existingTermConditions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to TermCondition
    async addImagesToTermCondition(TermConditionInputs: termConditionUpdateRequest) {
        try {
            const existingTermCondition: any = await this.repository.addImagesToTermCondition(
                TermConditionInputs
            );

            return FormateData({ existingTermCondition });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update TermCondition by id
    async updateById(TermConditionInputs: termConditionUpdateRequest) {
        try {
            const existingTermCondition: any = await this.repository.updateTermConditionById(
                TermConditionInputs
            );

            return FormateData({ existingTermCondition });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete TermCondition by id  (soft delete)
    async deleteTermCondition(TermConditionInputs: termConditionDeleteRequest) {
        try {
            const existingTermCondition: any = await this.repository.deleteTermConditionById(
                TermConditionInputs
            );

            return FormateData({ existingTermCondition });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = TermConditionService;
