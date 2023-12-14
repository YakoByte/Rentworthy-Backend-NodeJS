import { AboutUSModel } from "../models";
import { ObjectId } from 'mongodb';
import { FormateData } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { aboutUSRequest, aboutUSGetRequest, aboutUSUpdateRequest } from "../../interface/aboutUs";

class AboutUSRepository {
    //create aboutUS
    async CreateAboutUS(aboutUSInputs: aboutUSRequest) {
        try {
            const aboutUSResult = await AboutUSModel.create(aboutUSInputs);
            if (aboutUSResult) {
                return aboutUSResult;
            }
            return FormateData("Failed to create aboutUS");
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all aboutUS
    async getAboutUSById(aboutUSInputs: aboutUSGetRequest) {
        try {
            const aboutUSResult = await AboutUSModel.findById(aboutUSInputs._id);
            if(!aboutUSResult){
                return FormateData("No aboutUS");
            }
            return FormateData(aboutUSResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all aboutUS
    async getAllAboutUS() {
        try {
            const aboutUSResult = await AboutUSModel.find();
            if(!aboutUSResult){
                return FormateData("No aboutUS");
            }
            return FormateData(aboutUSResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get one aboutUS
    async getAboutUS(aboutUSInputs: aboutUSGetRequest) {
        try {
            const aboutUSResult = await AboutUSModel.find({title: aboutUSInputs.title});
            if(!aboutUSResult){
                return FormateData("No aboutUS");
            }
            return FormateData(aboutUSResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //add images to aboutUS
    async addImagesToAboutUS(aboutUSInputs: aboutUSUpdateRequest) {
        const aboutUSResult = await AboutUSModel.findOneAndUpdate( { _id: aboutUSInputs._id },
            { $set: { image: aboutUSInputs.image } },
            { new: true });
        if (aboutUSResult) {
            return FormateData(aboutUSResult);
        }
    }
    //update aboutUS by id
    async updateAboutUSById(aboutUSInputs: aboutUSUpdateRequest) {
        const aboutUSResult = await AboutUSModel.findOneAndUpdate(
            { _id: aboutUSInputs._id, isDeleted: false },
            { $set: aboutUSInputs },
            { new: true });

        if (aboutUSResult) {
            return FormateData(aboutUSResult);
        }
    }
    //delete aboutUS by id
    async deleteAboutUSById(aboutUSInputs: { _id: string }) {
        const aboutUSResult = await AboutUSModel.findOneAndUpdate(
            { _id: aboutUSInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (aboutUSResult) {
            return FormateData("aboutUS Deleted");
        }
    }
}

export default AboutUSRepository;
