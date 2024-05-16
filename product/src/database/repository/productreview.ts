import {
  productReviewModel,
  historyModel,
  productRatingModel,
  Bookings,
} from "../models";
import { Types } from "mongoose";
import { getProductReviewRequest } from "../../interface/productreview";
import { getAllProductLike } from "../../interface/productlike";

class ProductReviewRepository {
  async CreateProductReview(productInputs: any) {
    try {      
      const findProduct = await productReviewModel
        .findOne({
          productId: new Types.ObjectId(productInputs.productId),
          userId: new Types.ObjectId(productInputs.userId),
        });

      let bookings = await Bookings.aggregate([
        {
          $match: {
            productId: new Types.ObjectId(productInputs.productId),
            userId: new Types.ObjectId(productInputs.userId),
          },
        },
      ]);      

      if (bookings.length > 0) {
        if (findProduct) {
          const updateRes = await productReviewModel
            .findOneAndUpdate({ _id: new Types.ObjectId(findProduct._id) },
              { $set: { review: productInputs.review } },
              { new: true }
            );
          return updateRes;
        }
        const response = await productReviewModel.create(productInputs);
        const history = new historyModel({
          productId: response.productId,
          log: [
            {
              objectId: new Types.ObjectId(response._id),
              data: {
                userId: new Types.ObjectId(productInputs.userId),
              },
              action: `Review was created for this product id ${response.productId}`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return response;
      } else {
        return { message: "there needs to be a booking before giving review." };
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create product review");
    }
  }

  async GetProductReview(productInputs: getProductReviewRequest) {
    try {
      let searchQuery: any = {};
      if (productInputs.userId) {
        searchQuery.userId = new Types.ObjectId(productInputs.userId);
      }
      if (productInputs.productId) {
        searchQuery.productId = new Types.ObjectId(productInputs.productId);
      }
      let getRes = await productReviewModel.find(searchQuery).lean();
      let getRating = await productRatingModel.find(searchQuery).lean();

      // merge getRating and getRes
      let tempRes: any = [];
      getRes.forEach((element: any) => {
        let tempRating = getRating.find(
          (item: any) =>
            item.productId.toString() == element.productId.toString() &&
            item.userId.toString() == element.userId
        );
        if (tempRating) {
          element.rating = tempRating.rating;
        }
        tempRes.push(element);
      });

      return tempRes;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get product review");
    }
  }

  async GetAllProductReview(productInputs: getAllProductLike) {
    try {
      if (!productInputs.limit || !productInputs.page) {
        productInputs.limit = 0;
        productInputs.page = 0;
      }
      const findReview = await productReviewModel.aggregate([
        { $match: { productId: new Types.ObjectId(productInputs.productId), isDeleted: false } },
        { $skip: productInputs.page },
        { $limit: productInputs.limit },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "productId",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);
      return findReview;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get product review");
    }
  }
}

export default ProductReviewRepository;
