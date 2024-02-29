import { wishlistModel, historyModel } from "../models";
import { ObjectId } from "mongodb";
import {
  wishlistRequest,
  wishlistDeleteRequest,
  wishlistUpdatePayload,
  wishlistUpdateRequest,
  wishlistGetRequest,
} from "../../interface/wishlist";
import { generatePresignedUrl } from "../../utils/aws";

class WishlistRepository {
  //create wishlist
  async CreateWishlist(wishlistInputs: wishlistRequest) {
    let wishlistResult;
    try {
      const findWishlist = await wishlistModel.findOne({
        userId: wishlistInputs.userId,
        isDeleted: false,
      });

      if (findWishlist) {
        // update and add productIds

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
            pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
            as: "userId",
          },
        },
        {
          $unwind: "$productIds"
        },
        {
          $lookup: {
            from: "images",
            localField: "productIds.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productIds.images",
          },
        },
      ]);

      if(findWishlist.length === 0) {
        return { message: "Wishlist not found" };
      }

      for (const wishlist of findWishlist) {
        for (const image of wishlist.productIds.images) {
          if (image) {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }
        }
      }

      return findWishlist;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Wishlist");
    }
  }

  //get wishlist by userId
  async getWishlistByUserId(input: { userId: string }) {
    try {
      const findWishlist = await wishlistModel.aggregate([
        {
          $match: {
            userId: new ObjectId(input.userId),
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
            pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
            as: "userId",
          },
        },
        {
          $unwind: "$productIds"
        },
        {
          $lookup: {
            from: "images",
            localField: "productIds.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productIds.images",
          },
        },
      ]);
  
      if(findWishlist.length === 0) {
        return { message: "Wishlist not found" };
      }

      for (const wishlist of findWishlist) {
        for (const image of wishlist.productIds.images) {
          if (image) {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }
        }
      }

      return findWishlist;
    } catch (err) {
      console.log("Error:", err);
      throw new Error("Unable to Get Wishlist");
    }
  }

  //get all wishlist
  async getAllWishlist({ skip, limit }: { skip: number; limit: number }) {
    try {
      const findWishlist = await wishlistModel.aggregate([
        {
          $match: {
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
            pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
            as: "userId",
          },
        },
        {
          $unwind: "$productIds"
        },
        {
          $lookup: {
            from: "images",
            localField: "productIds.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productIds.images",
          },
        },
      ])
        .skip(skip)
        .limit(limit);

        if(findWishlist.length === 0) {
          return { message: "Wishlist not found" };
        }
  
        for (const wishlist of findWishlist) {
          for (const image of wishlist.productIds.images) {
            if (image) {
              let newPath = await generatePresignedUrl(image.imageName);
              image.path = newPath;
            }
          }
        }
  
        return findWishlist;
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

      if (findWishlist) {
        const wishlistResult = await wishlistModel.updateOne(
          { userId: wishlistRequest.userId },
          wishlistInputs
        );

        return wishlistResult;
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
