import { wishlistModel, historyModel } from "../models";
import { ObjectId } from "mongodb";
import {
  wishlistRequest,
  wishlistDeleteRequest,
  wishlistUpdatePayload,
  wishlistUpdateRequest,
  wishlistGetRequest,
} from "../../interface/wishlist";

class WishlistRepository {
  //create wishlist
  async CreateWishlist(wishlistInputs: wishlistRequest) {
    let wishlistResult;
    try {
      const findWishlist = await wishlistModel.findOne({
        userId: wishlistInputs.userId,
        isDeleted: false,
      });
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        // update and add productIds
        console.log("wishlistInputs", wishlistInputs);
        wishlistResult = await wishlistModel.findOneAndUpdate(
          {
            userId: wishlistInputs.userId,
            isDeleted: false,
            productIds: { $nin: wishlistInputs.productIds },
          },
          { $push: { productIds: [wishlistInputs.productIds] } },
          { new: true }
        );
        if (!wishlistResult) {
          return findWishlist;
        }
      } else {
        const wishlist = new wishlistModel(wishlistInputs);
        wishlistResult = await wishlist.save();
      }

      // const history = new historyModel({
      //     wishlistId: wishlistResult._id,
      //     log: [
      //         {
      //             objectId: wishlistResult._id,
      //             data: {
      //                 userId: wishlistInputs.userId,
      //             },
      //             action: `wishlistName = ${wishlistInputs.name} created`,
      //             date: new Date().toISOString(),
      //             time: Date.now(),
      //         },
      //     ],
      // });
      // await history.save();
      return wishlistResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Wishlist");
    }
  }

  //get wishlist by id
  async getWishlistById(wishlistInputs: { _id: string }) {
    try {
      const findWishlist = await wishlistModel.aggregate([
        { $match: { _id: new ObjectId(wishlistInputs._id), isDeleted: false } },
        {
          $lookup: {
            from: "products",
            localField: "productIds",
            foreignField: "_id",
            as: "productIds",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        return findWishlist;
      }
      return { message: "Wishlist not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Wishlist");
    }
  }

  //get wishlist by userId
  async getWishlistByUserId(wishlistInputs: { userId: string }) {
    try {
      const findWishlist = await wishlistModel.aggregate([
        {
          $match: {
            userId: new ObjectId(wishlistInputs.userId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productIds",
            foreignField: "_id",
            as: "productIds",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        return findWishlist;
      }
      return { message: "Wishlist not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Wishlist");
    }
  }

  //get all wishlist
  async getAllWishlist({ skip, limit }: { skip: number; limit: number }) {
    try {
      const findWishlist = await wishlistModel
        .find({ isDeleted: false })
        .populate("userId")
        .skip(skip)
        .limit(limit);
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        return findWishlist;
      }
      return { message: "Wishlist not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Wishlist");
    }
  }

  //update wishlist products
  async updateWishlist(
    wishlistRequest: wishlistUpdateRequest,
    wishlistInputs: wishlistUpdatePayload
  ) {
    try {
      const findWishlist = await wishlistModel.findOne({
        userId: wishlistRequest.userId,
        isDeleted: false,
      });
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        const wishlistResult = await wishlistModel.updateOne(
          { userId: wishlistRequest.userId },
          wishlistInputs
        );
        console.log("wishlistResult", wishlistResult);
        return { message: "Wishlist Updated" };
      }
      return { message: "Wishlist not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update Wishlist");
    }
  }

  //delete wishlist also delete his subwishlist
  async deleteWishlist(wishlistInputs: wishlistDeleteRequest) {
    try {
      const findWishlist = await wishlistModel.findOne({
        _id: wishlistInputs._id,
        isDeleted: false,
      });
      console.log("findWishlist", findWishlist);
      if (findWishlist) {
        // soft delete wishlist
        await wishlistModel.updateOne(
          { _id: wishlistInputs._id },
          { isDeleted: true }
        );
        return { message: "Wishlist Deleted" };
      }
      return { message: "Wishlist not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Delete Wishlist");
    }
  }
}

export default WishlistRepository;
