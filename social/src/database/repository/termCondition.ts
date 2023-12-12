import { TermConditionModel } from "../models";
import { ObjectId } from 'mongodb';
import { FormateData } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { termConditionRequest, termConditionGetRequest, termConditionUpdateRequest } from "../../interface/termCondition";

class TermConditionRepository {
    //create TermCondition
    async CreateTermCondition(TermConditionInputs: termConditionRequest) {
        try {
            const TermConditionResult = await TermConditionModel.create(TermConditionInputs);
            if (TermConditionResult) {
                return TermConditionResult;
            }
            return FormateData("Failed to create TermCondition");
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all TermCondition
    async getTermConditionById(TermConditionInputs: termConditionGetRequest) {
        try {
            const TermConditionResult = await TermConditionModel.findById(TermConditionInputs._id);
            if(!TermConditionResult){
                return FormateData("No TermCondition");
            }
            return FormateData(TermConditionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all TermCondition
    async getAllTermCondition() {
        try {
            const TermConditionResult = await TermConditionModel.find();
            if(!TermConditionResult){
                return FormateData("No TermCondition");
            }
            return FormateData(TermConditionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get one TermCondition
    async getTermCondition(TermConditionInputs: termConditionGetRequest) {
        try {
            const TermConditionResult = await TermConditionModel.find({title: TermConditionInputs.title});
            if(!TermConditionResult){
                return FormateData("No TermCondition");
            }
            return FormateData(TermConditionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //add images to TermCondition
    async addImagesToTermCondition(TermConditionInputs: termConditionUpdateRequest) {
        const TermConditionResult = await TermConditionModel.findOneAndUpdate( { _id: TermConditionInputs._id },
            { $set: { image: TermConditionInputs.image } },
            { new: true });
        if (TermConditionResult) {
            return FormateData(TermConditionResult);
        }
    }
    //update TermCondition by id
    async updateTermConditionById(TermConditionInputs: termConditionUpdateRequest) {
        const TermConditionResult = await TermConditionModel.findOneAndUpdate(
            { _id: TermConditionInputs._id, isDeleted: false },
            { $set: TermConditionInputs },
            { new: true });

        if (TermConditionResult) {
            return FormateData(TermConditionResult);
        }
    }
    //delete TermCondition by id
    async deleteTermConditionById(TermConditionInputs: { _id: string }) {
        const TermConditionResult = await TermConditionModel.findOneAndUpdate(
            { _id: TermConditionInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (TermConditionResult) {
            return FormateData("TermCondition Deleted");
        }
    }
}

export default TermConditionRepository;
