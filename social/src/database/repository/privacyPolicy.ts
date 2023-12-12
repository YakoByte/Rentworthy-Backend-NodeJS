import { PrivacyPolicyModel } from "../models";
import { ObjectId } from 'mongodb';
import { FormateData } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { privacyPolicyRequest, privacyPolicyGetRequest, privacyPolicyUpdateRequest } from "../../interface/privacyPolicy";

class PrivacyPolicyRepository {
    //create PrivacyPolicy
    async CreatePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyRequest) {
        try {
            const PrivacyPolicyResult = await PrivacyPolicyModel.create(PrivacyPolicyInputs);
            if (PrivacyPolicyResult) {
                return PrivacyPolicyResult;
            }
            return FormateData("Failed to create PrivacyPolicy");
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all PrivacyPolicy
    async getPrivacyPolicyById(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            const PrivacyPolicyResult = await PrivacyPolicyModel.findById(PrivacyPolicyInputs._id);
            if(!PrivacyPolicyResult){
                return FormateData("No PrivacyPolicy");
            }
            return FormateData(PrivacyPolicyResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all PrivacyPolicy
    async getAllPrivacyPolicy() {
        try {
            const PrivacyPolicyResult = await PrivacyPolicyModel.find();
            if(!PrivacyPolicyResult){
                return FormateData("No PrivacyPolicy");
            }
            return FormateData(PrivacyPolicyResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get one PrivacyPolicy
    async getPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
        try {
            const PrivacyPolicyResult = await PrivacyPolicyModel.find({title: PrivacyPolicyInputs.title});
            if(!PrivacyPolicyResult){
                return FormateData("No PrivacyPolicy");
            }
            return FormateData(PrivacyPolicyResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //add images to PrivacyPolicy
    async addImagesToPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate( { _id: PrivacyPolicyInputs._id },
            { $set: { image: PrivacyPolicyInputs.image } },
            { new: true });
        if (PrivacyPolicyResult) {
            return FormateData(PrivacyPolicyResult);
        }
    }
    //update PrivacyPolicy by id
    async updatePrivacyPolicyById(PrivacyPolicyInputs: privacyPolicyUpdateRequest) {
        const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate(
            { _id: PrivacyPolicyInputs._id, isDeleted: false },
            { $set: PrivacyPolicyInputs },
            { new: true });

        if (PrivacyPolicyResult) {
            return FormateData(PrivacyPolicyResult);
        }
    }
    //delete PrivacyPolicy by id
    async deletePrivacyPolicyById(PrivacyPolicyInputs: { _id: string }) {
        const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate(
            { _id: PrivacyPolicyInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (PrivacyPolicyResult) {
            return FormateData("PrivacyPolicy Deleted");
        }
    }
}

export default PrivacyPolicyRepository;
