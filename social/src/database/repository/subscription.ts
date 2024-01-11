import { SubscriptionModel } from "../models";
import { ObjectId } from 'mongodb';
import { FormateData } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { subscriptionRequest, subscriptionGetRequest, subscriptionUpdateRequest } from "../../interface/subscription";

class SubscriptionRepository {
    //create Subscription
    async CreateSubscription(SubscriptionInputs: subscriptionRequest) {
        try {
            const SubscriptionResult = await SubscriptionModel.create(SubscriptionInputs);
            if (SubscriptionResult) {
                return FormateData(SubscriptionResult);
            }
            return FormateData("Failed to create Subscription");
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all Subscription
    async getSubscriptionById(SubscriptionInputs: subscriptionGetRequest) {
        try {
            // const SubscriptionResult = await SubscriptionModel.findById(SubscriptionInputs._id);
            const SubscriptionResult = await SubscriptionModel.aggregate([
                {
                    $match: { ...SubscriptionInputs, isDeleted: false }
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "image",
                        foreignField: "_id",
                        as: "image"
                    }
                },
            ]);
            if (!SubscriptionResult) {
                return FormateData("No Subscription");
            }
            return FormateData(SubscriptionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all Subscription
    async getAllSubscription() {
        try {
            // const SubscriptionResult = await SubscriptionModel.find();
            const SubscriptionResult = await SubscriptionModel.aggregate([
                {
                    $match: { isDeleted: false }
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "image",
                        foreignField: "_id",
                        as: "image"
                    }
                },
            ]);
            if (!SubscriptionResult) {
                return FormateData("No Subscription");
            }
            return FormateData(SubscriptionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get one Subscription
    async getSubscription(SubscriptionInputs: subscriptionGetRequest) {
        try {
            const SubscriptionResult = await SubscriptionModel.find(SubscriptionInputs);
            if (!SubscriptionResult) {
                return FormateData("No Subscription");
            }
            return FormateData(SubscriptionResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

    //update Subscription by id
    async updateSubscriptionById(SubscriptionInputs: subscriptionUpdateRequest) {
        try {
            const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
                { _id: SubscriptionInputs._id },
                { ...SubscriptionInputs },
                { new: true });
            if (SubscriptionResult) {
                return FormateData(SubscriptionResult);
            }
            return FormateData("Failed to update Subscription");
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

    //delete Subscription by id
    async deleteSubscriptionById(SubscriptionInputs: { _id: string }) {
        const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
            { _id: SubscriptionInputs._id },
            { isDeleted: true },
            { new: true });
        if (SubscriptionResult) {
            return FormateData("Subscription Deleted");
        }
        return FormateData(false)
    }
}

export default SubscriptionRepository;
