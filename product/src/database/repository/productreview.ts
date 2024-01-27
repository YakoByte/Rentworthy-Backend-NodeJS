import {
  productReviewModel,
  historyModel,
  productRatingModel,
} from "../models";
import {
  productReviewRequest,
  getProductReviewRequest,
  AuthenticatedRequest,
} from "../../interface/productreview";
import axios from "axios";
import { getAllProductLike } from "../../interface/productlike";

class ProductReviewRepository {
  async CreateProductReview(productInputs: any) {
    try {
      const findProduct = await productReviewModel
        .findOne({
          productId: productInputs.productId,
          userId: productInputs.userId,
        })
        .lean();
      let tempBody: any = {
        productId: productInputs.productId,
        userId: productInputs.userId,
      };
      console.log("productInputs.token", productInputs.token);
      console.log("tempBody", tempBody);
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
          const updateRes = await productReviewModel
            .findOneAndUpdate(
              {
                _id: findProduct._id,
              },
              {
                $set: {
                  review: productInputs.review,
                },
              },
              {
                new: true,
              }
            )
            .lean();
          return updateRes;
        }
        const response = await productReviewModel.create(productInputs);
        const history = new historyModel({
          productId: response.productId,
          log: [
            {
              objectId: response._id,
              data: {
                userId: productInputs.userId,
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
        console.log("there needs to be a booking before giving review.");
        return { message: "there needs to be a booking before giving review." };
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create product review");
    }
  }

  async GetProductReview(productInputs: getProductReviewRequest) {
    try {
      let searchQuery: getProductReviewRequest = {};
      if (productInputs.userId) {
        searchQuery.userId = productInputs.userId;
      }
      if (productInputs.productId) {
        searchQuery.productId = productInputs.productId;
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
          console.log("tempRating", tempRating);
          element.rating = tempRating.rating;
        }
        console.log("element", element.rating);
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
      throw new Error("Unable to Get product review");
    }
  }
}

export default ProductReviewRepository;
