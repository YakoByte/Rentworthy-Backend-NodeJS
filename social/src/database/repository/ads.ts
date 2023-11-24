import { adsModel, productModel, historyModel } from "../models";
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
                return FormateData(adsResult);
            }
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all ads
    async getAllAds(adsInputs: adsGetRequest) {
        let adsResult
        try {
            // get ads by id
            if (adsInputs._id) {
                adsResult = await adsModel.findOne({ _id: adsInputs._id, isDeleted: false });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by userId
            if (adsInputs.userId) {
                adsResult = await adsModel.find({ userId: adsInputs.userId, isDeleted: false });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by productId
            if (adsInputs.productId) {
                adsResult = await adsModel.find({ productId: adsInputs.productId, isDeleted: false });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by categoryId
            if (adsInputs.categoryId) {
                adsResult = await adsModel.find({ categoryId: adsInputs.categoryId, isDeleted: false });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by subCategoryId
            if (adsInputs.subCategoryId) {
                adsResult = await adsModel.find({ subCategoryId: adsInputs.subCategoryId, isDeleted: false });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by nearBy
            if (adsInputs.lat && adsInputs.long) {
                adsResult = await adsModel.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: adsInputs.lat.toString() + adsInputs.long.toString()
                            },
                            $maxDistance: adsInputs.distance ? adsInputs.distance : 10000
                        }
                    }
                });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by city 
            if (adsInputs.city) {
                adsResult = await adsModel.find({ "address.city": adsInputs.city });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            //get ads by state
            if (adsInputs.state) {
                adsResult = await adsModel.find({ "address.state": adsInputs.state });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get ads by country
            if (adsInputs.country) {
                adsResult = await adsModel.find({ "address.country": adsInputs.country });
                if (adsResult) {
                    return FormateData(adsResult);
                }
            }
            // get all ads
            adsResult = await adsModel.find({ isDeleted: false });
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
