import { adsModel, productModel } from "../models";
import { ObjectId } from "mongodb";

import {
  adsRequest,
  adsGetRequest,
  adsUpdateRequest,
} from "../../interface/ads";

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
    let adsResult;
    try {
      const baseQuery = { isDeleted: false };

      const queryConditions = [];

      if (adsInputs._id) {
        queryConditions.push({ _id: new ObjectId(adsInputs._id) });
      }

      if (adsInputs.user) {
        console.log("adsInputs.user", adsInputs.user);
        queryConditions.push({ userId: new ObjectId(adsInputs.user._id) });
      }
      if (adsInputs.productId) {
        queryConditions.push({
          productId: new ObjectId(adsInputs.productId),
          isApproved: true,
        });
      }
      if (adsInputs.categoryId) {
        queryConditions.push({
          categoryId: new ObjectId(adsInputs.categoryId),
          isApproved: true,
        });
      }
      if (adsInputs.subCategoryId) {
        queryConditions.push({
          subCategoryId: new ObjectId(adsInputs.subCategoryId),
          isApproved: true,
        });
      }
      if (adsInputs.city) {
        queryConditions.push({
          "address.city": adsInputs.city,
          isApproved: true,
        });
      }
      if (adsInputs.state) {
        queryConditions.push({
          "address.state": adsInputs.state,
          isApproved: true,
        });
      }
      if (adsInputs.country) {
        queryConditions.push({
          "address.country": adsInputs.country,
          isApproved: true,
        });
      }

      try {
        if (queryConditions.length > 0) {
          let agg: any = [
            {
              $match: {
                ...baseQuery,
                $or: queryConditions,
              },
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
                          {
                            $eq: ["$userId", new ObjectId(adsInputs.user._id)],
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
                coordinates: [21.214355483720226, 72.90335545753537],
              },
              distanceField: "dist.calculated",
              maxDistance: 10000,
              spherical: true,
            };
            agg.unshift({ $geoNear: nearVar });
          }

          adsResult = await adsModel.aggregate(agg);
        }
      } catch (error) {
        console.error(error);
      }

      if (adsResult) {
        return adsResult;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Ads");
    }
  }

  //add images to ads
  async addImagesToAds(adsInputs: adsRequest) {
    try {
      const adsResult = await adsModel.findOneAndUpdate(
        { _id: adsInputs._id, isDeleted: false },
        { $set: { images: adsInputs.images } },
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
