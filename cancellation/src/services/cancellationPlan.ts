import cancellationPlanRepository from '../database/repository/cancellationPlan';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { cancellationPlanRequest, cancellationPlanUpdateRequest, cancellationPlanGetRequest, cancellationPlanDeleteRequest } from '../interface/cancellationPlan';

// All Business logic will be here
class cancellationPlanService {
    private repository: cancellationPlanRepository;

    constructor() {
        this.repository = new cancellationPlanRepository();
    }
    // create cancellationPlan
    async CreateCancellationPlan(cancellationPlanInputs: cancellationPlanRequest) {
        try {
            console.log("cancellationPlanInputs", cancellationPlanInputs)
            const existingCancellationPlan: any = await this.repository.CreateCancellationPlan(
                cancellationPlanInputs
            );

            return FormateData({ existingCancellationPlan });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
    // get cancellationPlan by id , userId or all cancellationPlan
    async getCancellationPlan(cancellationPlanInputs: cancellationPlanGetRequest) {
        try {
            let existingCancellationPlan: any
            existingCancellationPlan = await this.repository.getAllCancellationPlan(
                cancellationPlanInputs
            );

            return FormateData({ existingCancellationPlan });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update cancellationPlan by id
    async updateCancellationPlanById(cancellationPlanInputs: cancellationPlanUpdateRequest) {
        try {
            const existingCancellationPlan: any = await this.repository.updateCancellationPlanById(
                cancellationPlanInputs
            );

            return FormateData({ existingCancellationPlan });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete cancellationPlan by id  (soft delete)
    async deleteCancellationPlan(cancellationPlanInputs: cancellationPlanDeleteRequest) {
        try {
            const existingCancellationPlan: any = await this.repository.deleteCancellationPlanById(
                cancellationPlanInputs
            );

            return FormateData({ existingCancellationPlan });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = cancellationPlanService;
