import { cancellationPlanModel, productModel, historyModel } from "../models";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { cancellationPlanRequest, cancellationPlanGetRequest, cancellationPlanUpdateRequest, cancellationPlanDeleteRequest } from "../../interface/cancellationPlan";
class CancellationPlanRepository {
    //create cancellationPlan
    async CreateCancellationPlan(cancellationPlanInputs: cancellationPlanRequest) {
        try {
            const cancellationPlan = await cancellationPlanModel.create(cancellationPlanInputs);
            return FormateData(cancellationPlan);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    //get cancellationPlan by id , all cancellationPlan

    async getAllCancellationPlan(cancellationPlanInputs: cancellationPlanGetRequest) {
        try {
            let cancellationPlan: any
            if (cancellationPlanInputs._id) {
                cancellationPlan = await cancellationPlanModel.findOne(
                    {
                        _id: cancellationPlanInputs._id,
                        isDeleted: false
                    });
            } else {
                cancellationPlan = await cancellationPlanModel.find(
                    {
                        isDeleted: false
                    });
            }
            return FormateData(cancellationPlan);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    //update cancellationPlan by id
    async updateCancellationPlanById(cancellationPlanInputs: cancellationPlanUpdateRequest) {
        const cancellationPlanResult = await cancellationPlanModel.findOneAndUpdate(
            { _id: cancellationPlanInputs._id, isDeleted: false },
            { ...cancellationPlanInputs },
            { new: true });
        if (cancellationPlanResult) {
            return FormateData(cancellationPlanResult);
        }
    }
    //delete cancellationPlan by id
    async deleteCancellationPlanById(cancellationPlanInputs: cancellationPlanDeleteRequest) {
        const cancellationPlanResult = await cancellationPlanModel.findOneAndUpdate(
            { _id: cancellationPlanInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (cancellationPlanResult) {
            return FormateData(cancellationPlanResult);
        }
    }
}

export default CancellationPlanRepository;
