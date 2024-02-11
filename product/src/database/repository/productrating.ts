import { productRatingModel, historyModel } from "../models";
import {
  productRatingRequest,
  getProductRatingRequest,
  AuthenticatedRequest,
  getAllProductRating,
} from "../../interface/productrating";
import axios from "axios";

class ProductRatingRepository {
  async CreateProductRating(productInputs: any) {
    try {
      const findProduct = await productRatingModel
        .findOne({
          productId: productInputs.productId,
          userId: productInputs.userId,
        })
        .lean();
      let tempBody: any = {
        productId: productInputs.productId,
        userId: productInputs.userId,
      };
      let bookings = await axios.get(
        "https://backend.rentworthy.us/app/api/v1/renting/get-booking",
        {
          params: tempBody,
          headers: {
            Authorization: productInputs.token,
          },
        }
      );

      if (bookings.data.data.length) {
        if (findProduct) {
          const updateRes = await productRatingModel
            .findOneAndUpdate(
              {
                _id: findProduct._id,
              },
              {
                $set: {
                  rating: productInputs.rating,
                },
              },
              {
                new: true,
              }
            )
            .lean();
          return updateRes;
        }
        const response = await productRatingModel.create(productInputs);
        const history = new historyModel({
          productId: response.productId,
          log: [
            {
              objectId: response._id,
              data: {
                userId: productInputs.userId,
              },
              action: `Rating was created for this product id ${response.productId}`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return response;
      } else {
        return { message: "there needs to be a booking before rating it." };
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create product rating");
    }
  }

  async GetProductRating(productInputs: getProductRatingRequest) {
    try {
      let searchQuery: getProductRatingRequest = {};
      if (productInputs.userId) {
        searchQuery.userId = productInputs.userId;
      }
      if (productInputs.productId) {
        searchQuery.productId = productInputs.productId;
      }
      let getRes = await productRatingModel.find(searchQuery).lean();
      return getRes;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get product rating");
    }
  }

  async GetAllProductRating(productInputs: getAllProductRating) {
    try {
      if (!productInputs.limit || !productInputs.page) {
        productInputs.limit = 0;
        productInputs.page = 0;
      }

      const findReview = await productRatingModel.aggregate([
        { $match: { productId: productInputs.productId, isDeleted: false } },
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
      throw new Error("Unable to Get product rating");
    }
  }

  async GetRatingCount(productInputs: getAllProductRating) {
    try {
      const countsPromises = Array.from({ length: 5 }, (_, index) =>
        productRatingModel.countDocuments({
          productId: productInputs.productId,
          rating: index + 1,
          isDeleted: false,
        })
      );

      // Wait for all count promises to resolve
      const counts = await Promise.all(countsPromises);

      const [count1, count2, count3, count4, count5] = counts;
      const count = counts.reduce(
        (total, currentCount) => total + currentCount,
        0
      );

      const averageRating =
        count > 0
          ? (count1 + count2 * 2 + count3 * 3 + count4 * 4 + count5 * 5) / count
          : 0;

      const RatingData = {
        totalRating: count || 0,
        averageRating: averageRating || 0,
        ratingDistribution: [
          { label: "5", value: count5 || 0 },
          { label: "4", value: count4 || 0 },
          { label: "3", value: count3 || 0 },
          { label: "2", value: count2 || 0 },
          { label: "1", value: count1 || 0 },
        ],
      };

      return RatingData;
    } catch (err) {
      console.log("error", err);
      throw {
        totalRating: 0,
        averageRating: 0,
        ratingDistribution: [
          { label: "5", value: 0 },
          { label: "4", value: 0 },
          { label: "3", value: 0 },
          { label: "2", value: 0 },
          { label: "1", value: 0 },
        ],
      };
    }
  }
}

export default ProductRatingRepository;
