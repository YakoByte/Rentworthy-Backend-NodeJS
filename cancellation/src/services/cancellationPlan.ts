import cancellationPlanRepository from '../database/repository/cancellationPlan';
import { FormateData, FormateError } from '../utils';

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

            return FormateData(existingCancellationPlan);
        } catch (err: any) {
            console.log("err", err.message)
            return FormateError({ error: "Data not Created" });
        }
    }
    // get cancellationPlan by id , userId or all cancellationPlan
    async getCancellationPlan(cancellationPlanInputs: cancellationPlanGetRequest) {
        try {
            let existingCancellationPlan: any
            existingCancellationPlan = await this.repository.getAllCancellationPlan(
                cancellationPlanInputs
            );

            return FormateData(existingCancellationPlan);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not Found" });
        }
    }
    // update cancellationPlan by id
    async updateCancellationPlanById(cancellationPlanInputs: cancellationPlanUpdateRequest) {
        console.log("cancellationPlanInputs", cancellationPlanInputs)
        try {
            const existingCancellationPlan: any = await this.repository.updateCancellationPlanById(
                cancellationPlanInputs
            );

            return FormateData(existingCancellationPlan);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not updated" });
        }
    }
    // delete cancellationPlan by id  (soft delete)
    async deleteCancellationPlan(cancellationPlanInputs: cancellationPlanDeleteRequest) {
        try {
            const existingCancellationPlan: any = await this.repository.deleteCancellationPlanById(
                cancellationPlanInputs
            );

            return FormateData(existingCancellationPlan);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not Deleted" });
        }
    }

    async getCountOfCancellationPerDay() {
        try {
            const CancellationPlan: any = await this.repository.getCountOfCancellationPerDay();

            return FormateData(CancellationPlan);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not Found" });
        }
    }
}

export = cancellationPlanService;
