import { adsModel, productModel, historyModel } from "../models";
import { ObjectId } from 'mongodb';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
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
                queryConditions.push({ productId: new ObjectId(adsInputs.productId), isApproved: true });
            }
            if (adsInputs.categoryId) {
                queryConditions.push({ categoryId: new ObjectId(adsInputs.categoryId), isApproved: true });
            }
            if (adsInputs.subCategoryId) {
                queryConditions.push({ subCategoryId: new ObjectId(adsInputs.subCategoryId), isApproved: true });
            }
            // if (adsInputs.lat && adsInputs.long) {
            //     queryConditions.push({
            //         $geoNear: {
            //             near: {
            //                 type: "Point",
            //                 coordinates: [
            //                     21.214355483720226, 72.90335545753537
            //                 ],
            //             },
            //             distanceField: "dist.calculated",
            //             maxDistance: 10000,
            //             spherical: true,
            //         },
            //     });
            // }
            if (adsInputs.city) {
                queryConditions.push({ "address.city": adsInputs.city, isApproved: true });
            }
            if (adsInputs.state) {
                queryConditions.push({ "address.state": adsInputs.state, isApproved: true });
            }
            if (adsInputs.country) {
                queryConditions.push({ "address.country": adsInputs.country, isApproved: true });
            }


            try {
                if (queryConditions.length > 0) {
                    let agg: any = [
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
                            $lookup: {
                                from: "images",
                                localField: "image",
                                foreignField: "_id",
                                as: "image"
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
                    ]
                    if (adsInputs.lat && adsInputs.long) {
                        let nearVar = {
                            'near': {
                                'type': 'Point',
                                'coordinates': [
                                    21.214355483720226, 72.90335545753537
                                ]
                            },
                            'distanceField': 'dist.calculated',
                            'maxDistance': 10000,
                            'spherical': true
                        }
                        agg.unshift({ $geoNear: nearVar })
                    }
                    console.log("queryConditions", agg)
                    // adsResult = await adsModel.aggregate([

                    //     {
                    //       '$match': {
                    //         'userId': new ObjectId('6576ba83d175f4f57b480f53')
                    //       }
                    //     },
                    //     {
                    //         $lookup: {
                    //             from: "wishlists",
                    //             let: { productId: "$productId" },
                    //             pipeline: [
                    //                 {
                    //                     $match: {
                    //                         $expr: {
                    //                             $and: [
                    //                                 { $eq: ["$userId", new ObjectId(adsInputs.user._id)] },
                    //                                 { $in: ["$$productId", "$productIds"] }
                    //                             ]
                    //                         }
                    //                     }
                    //                 }
                    //             ],
                    //             as: "wishlist"
                    //         }
                    //     },
                    //     {
                    //         $addFields: {
                    //             isFav: {
                    //                 $cond: {
                    //                     if: { $eq: [{ $size: "$wishlist" }, 0] },
                    //                     then: false,
                    //                     else: true
                    //                 }
                    //             }
                    //         }
                    //     }
                    // ]);
                    // adsResult = await adsModel.aggregate([
                    //     {
                    //       '$geoNear': {
                    //         'near': {
                    //           'type': 'Point', 
                    //           'coordinates': [
                    //             21.214355483720226, 72.90335545753537
                    //           ]
                    //         }, 
                    //         'distanceField': 'dist.calculated', 
                    //         'maxDistance': 10000, 
                    //         'spherical': true
                    //       }
                    //     }, {
                    //       '$match': {
                    //         'userId': new ObjectId('6576ba83d175f4f57b480f53')
                    //       }
                    //     }, {
                    //       '$lookup': {
                    //         'from': 'wishlists', 
                    //         'let': {
                    //           'productId': '$productId'
                    //         }, 
                    //         'pipeline': [
                    //           {
                    //             '$match': {
                    //               '$expr': {
                    //                 '$and': [
                    //                   {
                    //                     '$eq': [
                    //                       '$userId', new ObjectId('6576ba83d175f4f57b480f53')
                    //                     ]
                    //                   }, {
                    //                     '$in': [
                    //                       '$$productId', '$productIds'
                    //                     ]
                    //                   }
                    //                 ]
                    //               }
                    //             }
                    //           }
                    //         ], 
                    //         'as': 'wishlist'
                    //       }
                    //     }, {
                    //       '$addFields': {
                    //         'isFav': {
                    //           '$cond': {
                    //             'if': {
                    //               '$eq': [
                    //                 {
                    //                   '$size': '$wishlist'
                    //                 }, 0
                    //               ]
                    //             }, 
                    //             'then': false, 
                    //             'else': true
                    //           }
                    //         }
                    //       }
                    //     }
                    //   ])
                    adsResult = await adsModel.aggregate(agg);
                }
            } catch (error) {
                console.error(error);
            }
            console.log("adsResult", adsResult)

            if (adsResult) {
                return (adsResult);
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
        console.log("adsInputs", adsInputs)
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { $set: adsInputs },
            { new: true });
        console.log("adsResult", adsResult)
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
            { isApproved: true, approvedBy: adsInputs.approvedBy },
            { new: true });
        if (adsResult) {
            return FormateData(adsResult);
        }
    }
    // reject ads by product owner
    async rejectAds(adsInputs: adsUpdateRequest) {
        console.log("adsInputs", adsInputs)
        //check ads is exist or not
        let ads = await adsModel.findOne(
            {
                _id: adsInputs._id,
                isDeleted: false
            });
        // console.log("ads", ads)
        if (!ads) {
            return FormateData({ message: "Ads not found" });
        }
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { isApproved: false, approvedBy: adsInputs.approvedBy },
            { new: true });
        console.log("adsResult", adsResult)
        if (adsResult) {
            return adsResult;
        }
    }
    //delete ads by id
    async deleteAdsById(adsInputs: { _id: string }) {
        const adsResult = await adsModel.findOneAndUpdate(
            { _id: adsInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (adsResult) {
            return FormateData("Ads Deleted");
        }
    }
}

export default AdsRepository;
