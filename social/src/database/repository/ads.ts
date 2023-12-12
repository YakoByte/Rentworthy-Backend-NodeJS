import { adsModel, productModel, historyModel } from "../models";
import { ObjectId } from 'mongodb';
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
import { adsRequest, adsGetRequest, adsUpdateRequest } from "../../interface/ads";
import ads from "../../api/ads";
class AdsRepository {
    //create ads
    async CreateAds(adsInputs: adsRequest) {
        let adsResult
        try {
            //check product is exist or not
            let product = await productModel.findOne({ _id: adsInputs.productId, isDeleted: false });
            if (!product) {
                return FormateData({ message: "Product not found" });
            }
            adsResult = await adsModel.create(adsInputs);
            if (adsResult) {
                return adsResult;
            }
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all ads
    async getAllAds(adsInputs: adsGetRequest) {
        let adsResult
        try {

            const baseQuery = { isDeleted: false };

            const queryConditions = [];

            if (adsInputs._id) {
                queryConditions.push({ _id: new ObjectId(adsInputs._id) });
            }

            if (adsInputs.user) {
                console.log("adsInputs.user", adsInputs.user)
                queryConditions.push({ userId: new ObjectId(adsInputs.user._id) });
            }
            if (adsInputs.productId) {
                queryConditions.push({ productId: new ObjectId(adsInputs.productId) });
            }
            if (adsInputs.categoryId) {
                queryConditions.push({ categoryId: new ObjectId(adsInputs.categoryId) });
            }
            if (adsInputs.subCategoryId) {
                queryConditions.push({ subCategoryId: new ObjectId(adsInputs.subCategoryId) });
            }
            if (adsInputs.lat && adsInputs.long) {
                queryConditions.push({
                    "location": {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [Number(adsInputs.lat), Number(adsInputs.long)]
                            },
                            $maxDistance: adsInputs.distance ? adsInputs.distance : 10000
                        }
                    }
                });
            }
            if (adsInputs.city) {
                queryConditions.push({ "address.city": adsInputs.city });
            }
            if (adsInputs.state) {
                queryConditions.push({ "address.state": adsInputs.state });
            }
            if (adsInputs.country) {
                queryConditions.push({ "address.country": adsInputs.country });
            }


            try {
                if (queryConditions.length > 0) {
                    console.log("queryConditions", queryConditions, baseQuery)
                    adsResult = await adsModel.aggregate([
                        {
                            $match: {
                                ...baseQuery,
                                $or: queryConditions
                            }
                        },
                        {
                            $lookup: {
                                from: "wishlists",
                                let: { productId: "$productId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$userId", new ObjectId(adsInputs.user._id)] },
                                                    { $in: ["$$productId", "$productIds"] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: "wishlist"
                            }
                        },
                        {
                            $addFields: {
                                isFav: {
                                    $cond: {
                                        if: { $eq: [{ $size: "$wishlist" }, 0] },
                                        then: false,
                                        else: true
                                    }
                                }
                            }
                        }
                    ]);
                }
            } catch (error) {
                console.error(error);
            }
            console.log("adsResult", adsResult)

            if (adsResult) {
                return FormateData(adsResult);
            }
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //add images to ads
    async addImagesToAds(adsInputs: adsRequest) {
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { $set: { image: adsInputs.image } },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
    //update ads by id
    async updateAdsById(adsInputs: adsRequest) {
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { ...adsInputs },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
    //approve ads by product owner
    async approveAds(adsInputs: adsUpdateRequest) {
        //check ads is exist or not
        let ads = await adsModel.findOne(
            {
                _id: adsInputs._id,
                isDeleted: false
            });
        if (!ads) {
            return FormateData({ message: "Ads not found" });
        }
        //check product owner 
        let product = await productModel.findOne(
            {
                _id: ads.productId,
                userId: adsInputs.approvedBy,
                isDeleted: false
            });
        if (!product) {
            return FormateData({ message: "unauthorized user for this product" });
        }
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { isAccepted: true, approvedBy: adsInputs.approvedBy },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
    // reject ads by product owner
    async rejectAds(adsInputs: adsUpdateRequest) {
        //check ads is exist or not
        let ads = await adsModel.findOne(
            {
                _id: adsInputs._id,
                isDeleted: false
            });
        if (!ads) {
            return FormateData({ message: "Ads not found" });
        }
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { isAccepted: false, approvedBy: adsInputs.approvedBy },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
    //delete ads by id
    async deleteAdsById(adsInputs: { _id: string }) {
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
}

export default AdsRepository;
