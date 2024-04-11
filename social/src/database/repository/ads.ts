import { adsModel, productModel } from "../models";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import {
  adsRequest,
  adsGetRequest,
  adsUpdateRequest,
} from "../../interface/ads";
import { generatePresignedUrl } from "../../utils/aws";

class AdsRepository {
  //create ads
  async CreateAds(adsInputs: adsRequest) {
    let adsResult;
    try {
      //check product is exist or not
      let product = await productModel.findOne({
        _id: adsInputs.productId,
        isDeleted: false,
      });
      if (!product) {
        return { message: "Product not found" };
      }

      adsResult = await adsModel.create(adsInputs);
      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Ads");
    }
  }

  //get all ads
  async getAllAds(adsInputs: adsGetRequest) {
    try {    
      const skip = Number(adsInputs.page) * Number(adsInputs.limit) - Number(adsInputs.limit) || 0;
      const limit = Number(adsInputs.limit) || 10;

      let criteria: any = { isDeleted: false };
      
      if (adsInputs._id) {
        criteria._id = new Types.ObjectId(adsInputs._id);
      }
      if(adsInputs.productId) {
        criteria.productId = new Types.ObjectId(adsInputs.productId);
      }
      if(adsInputs.userId) {
        criteria.userId = new Types.ObjectId(adsInputs.userId);
      }

        let agg: any = [
          {
            $match: criteria,
          },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "wishlists",
              let: { productId: "$productId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$userId", new ObjectId(adsInputs?.user?._id)],
                        },
                        { $in: ["$$productId", "$productIds"] },
                      ],
                    },
                  },
                },
              ],
              as: "wishlist",
            },
          },
          {
            $lookup: {
              from: "images",
              localField: "images",
              foreignField: "_id",
              as: "images",
            },
          },
          {
            $addFields: {
              isFav: {
                $cond: {
                  if: { $eq: [{ $size: "$wishlist" }, 0] },
                  then: false,
                  else: true,
                },
              },
            },
          },
        ];
  
        if (adsInputs.lat && adsInputs.long) {
          let nearVar = {
            near: {
              type: "Point",
              coordinates: [adsInputs.lat, adsInputs.long],
            },
            distanceField: "dist.calculated",
            maxDistance: 10000,
            spherical: true,
          };
          agg.unshift({ $geoNear: nearVar });
        }
  
        let adsResult = await adsModel.aggregate(agg);
  
        await Promise.all(
          adsResult.map(async (ads) => {
            if (ads.images.length > 0) {
              await Promise.all(
                ads.images.map(async (element: any) => {
                  const newPath = await generatePresignedUrl(element.imageName);
                  element.path = newPath;
                })
              );
            }
          })
        );

        const countAds = await adsModel.countDocuments(criteria);
  
      return {adsResult, countAds};
      return ;
    } catch (error) {
      console.error("Error in getAllAds:", error);
      throw new Error("Unable to Get Ads");
    }
  }

  //add images to ads
  async addImagesToAds(adsInputs: adsRequest) {
    try {
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { $push: { images: adsInputs.images } },
        { new: true }
      );
      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to add images Ads");
    }
  }
  
  //update ads by id
  async updateAdsById(adsInputs: adsRequest) {
    try {
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { $set: adsInputs },
        { new: true }
      );

      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to update Ads");
    }
  }

  //approve ads by product owner
  async approveAds(adsInputs: adsUpdateRequest) {
    try {
      //check ads is exist or not
      let ads = await adsModel.findOne({
        _id: adsInputs._id,
        isDeleted: false,
      });
      if (!ads) {
        return { message: "Ads not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: ads.productId,
        userId: adsInputs.approvedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { isApproved: true, approvedBy: adsInputs.approvedBy },
        { new: true }
      );
      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Approved Ads");
    }
  }

  // reject ads by product owner
  async rejectAds(adsInputs: adsUpdateRequest) {
    try {
      //check ads is exist or not
      let ads = await adsModel.findOne({
        _id: adsInputs._id,
        isDeleted: false,
      });
      // console.log("ads", ads)
      if (!ads) {
        return { message: "Ads not found" };
      }
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { isApproved: false, approvedBy: adsInputs.approvedBy },
        { new: true }
      );

      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Reject Ads");
    }
  }

  //delete ads by id
  async deleteAdsById(adsInputs: { _id: string }) {
    try {
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (adsResult) {
        return { message: "Ads Deleted" };
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to delete Ads");
    }
  }
}

export default AdsRepository;
