import { productModel, historyModel, Bookings } from "../models";
import { Types } from "mongoose";
import { FormateData } from "../../utils";
import { BadRequestError, STATUS_CODES } from "../../utils/app-error";
import {
  productRequest,
  productDeleteRequest,
  productUpdateRequest,
  productSorting,
  productGetRequest,
} from "../../interface/product";
import productReservationService from "../../services/productreservation";
const ResRepo = new productReservationService();

class ProductRepository {
  //create product
  async CreateProduct(productInputs: productRequest) {
    // try {
    const findProduct = await productModel.findOne({
      name: productInputs.name,
    });
    console.log("findProduct", findProduct);
    if (findProduct) {
      return FormateData({ id: findProduct._id, name: findProduct.name });
    }

    const product = new productModel(productInputs);
    const productResult = await product.save();
    let resObj = {
      productId: productResult._id.toString(),
      startDate: productInputs.rentingDate.startDate,
      endDate: productInputs.rentingDate.endDate,
    };
    ResRepo.CreateProductReservation(resObj);
    const history = new historyModel({
      productId: productResult._id,
      log: [
        {
          objectId: productResult._id,
          data: {
            userId: productInputs.userId,
          },
          action: `productName = ${productInputs.name} created`,
          date: new Date().toISOString(),
          time: Date.now(),
        },
      ],
    });
    await history.save();

    return productResult;
    // } catch (err) {
    //     throw new APIError(
    //         "API Error",
    //         STATUS_CODES.INTERNAL_ERROR,
    //         "Unable to Create User"
    //     );
    // }
  }

  //get product by id
  async getProductById(productInputs: { _id: string }) {
    try {
      const findProduct = await productModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(productInputs._id),
            isDeleted: false,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "images",
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

      if (findProduct.length === 0) {
        return {
          STATUS_CODE: STATUS_CODES.NOT_FOUND,
          data: [],
          message: "Product not found",
        };
      }

      await productModel.updateOne(
        { _id: productInputs._id },
        { $inc: { viewCount: 1 } }
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

      let productBooking = await Bookings.find({
        productId: productInputs._id,
        endDate: {
          $gte: today, // Greater than or equal to the beginning of today
        },
      }).select({
        _id: 1,
        startDate: 1,
        endDate: 1,
        quantity: 1,
        status: 1,
      });

      let productData = [];
      let bookingData = [];

      productData.push(...findProduct);

      if (productBooking.length > 0) {
        bookingData.push(...productBooking);
      }

      return {
        STATUS_CODE: STATUS_CODES.OK,
        data: productData,
        bookingData: bookingData,
      };
    } catch (err: any) {
      return {
        STATUS_CODE: STATUS_CODES.INTERNAL_ERROR,
        data: [],
        message: err.message,
      };
    }
  }

  // get product by category id
  async getProductByCategoryId(productInputs: productGetRequest) {
    try {
      const findProduct = await productModel.aggregate([
        {
          $match: {
            categoryId: new Types.ObjectId(productInputs.categoryId),
            isDeleted: false,
            isActive: true,
          },
        },
        // { $skip: productInputs.page as number },
        // { $limit: productInputs.limit },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "images",
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
      // const findProduct = await productModel.find({ categoryId: productInputs.categoryId, isDeleted: false, isActive: true }).populate("images");
      console.log("findProduct", findProduct);
      if (findProduct) {
        return FormateData(findProduct);
      }
    } catch (err: any) {
      return new BadRequestError("Data Not found", err);
    }
  }

  // get product by subcategory id
  async getProductBySubCategoryId(productInputs: productGetRequest) {
    console.log("skip", productInputs.page, "limit", productInputs.limit);
    const findProduct = await productModel.aggregate([
      {
        $match: {
          subCategoryId: new Types.ObjectId(productInputs.subCategoryId),
          isDeleted: false,
          isActive: true,
        },
      },
      // { $skip: productInputs.page as number },
      // { $limit: productInputs.limit },
      {
        $lookup: {
          from: "images",
          localField: "images",
          foreignField: "_id",
          pipeline: [{ $project: { path: 1, _id: 0 } }],
          as: "images",
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
    // const findProduct = await productModel.find({ subCategoryId: productInputs.subCategoryId, isDeleted: false, isActive: true }).populate("images");
    console.log("findProduct", findProduct);
    if (findProduct) {
      return FormateData(findProduct);
    }
  }

  //get all product
  async getAllProduct({ skip, limit }: { skip: number; limit: number }) {
    try {
      console.log("skip", skip, "limit", limit);
      const findProduct = await productModel.aggregate([
        { $match: { isDeleted: false, isActive: true } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "images",
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
      console.log("findProduct", findProduct);
      if (findProduct) {
        return { STATUS_CODE: STATUS_CODES.OK, data: findProduct };
      }
    } catch (err: any) {
      return {
        STATUS_CODE: STATUS_CODES.NOT_FOUND,
        data: [],
        message: err.message,
      };
    }
  }

  // get product sorting wise
  async getProductPriceSortingWise(productInputs: productSorting) {
    try {
      // console.log("skip", productInputs.page, "limit", productInputs.limit)
      const findProduct = await productModel.aggregate([
        { $match: { isDeleted: false, isActive: true } },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "images",
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
        { $sort: { price: productInputs.price === "asc" ? 1 : -1 } },
      ]);
      console.log("findProduct", findProduct);
      if (findProduct) {
        return FormateData(findProduct);
      }
    } catch (err: any) {
      return new BadRequestError("Data Not found", err);
    }
  }

  // get product by location
  async getProductByLocation(productInputs: { lat: number; long: number }) {
    try {
      const findProduct = await productModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [productInputs.lat, productInputs.long],
            },
            distanceField: "dist.calculated",
            maxDistance: 100000,
            includeLocs: "dist.location",
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { path: 1, _id: 0 } }],
            as: "images",
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
      console.log("findProduct", findProduct);
      if (findProduct) {
        return FormateData(findProduct);
      }
    } catch (err: any) {
      return new BadRequestError("Data Not found", err);
    }
  }

  // get product by name and search using regex
  async getProductByName(productInputs: { name: string }) {
    // const findProduct = await productModel.find({ name: { $regex: productInputs.name, $options: 'i' }, isDeleted: false, isActive: true }).populate("images");
    const findProduct = await productModel.aggregate([
      {
        $match: {
          name: { $regex: productInputs.name, $options: "i" },
          isDeleted: false,
          isActive: true,
        },
      },
      // { $skip: productInputs.skip },
      // { $limit: productInputs.limit },
      {
        $lookup: {
          from: "images",
          localField: "images",
          foreignField: "_id",
          pipeline: [{ $project: { path: 1, _id: 0 } }],
          as: "images",
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
    console.log("findProduct", findProduct);
    if (findProduct) {
      return FormateData(findProduct);
    }
  }

  //update product name, description, isActive, isShow, image
  async updateProduct(productInputs: productUpdateRequest) {
    try {
      const productResult = await productModel.findOneAndUpdate(
        { _id: productInputs._id, isDeleted: false },
        productInputs,
        { new: true } // Return the modified document
      );

      if (productResult) {
        const history = new historyModel({
          productId: productInputs._id,
          log: [
            {
              objectId: productInputs._id,
              userId: productInputs.userId,
              action: `productName = ${productInputs.name} updated`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });

        await history.save();

        return { STATUS_CODES: STATUS_CODES.OK, data: "Product Updated" };
      } else {
        return {
          STATUS_CODES: STATUS_CODES.NOT_FOUND,
          data: "Product not found or already deleted",
        };
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        STATUS_CODES: STATUS_CODES.INTERNAL_ERROR,
        data: "Error updating product",
      };
    }
  }

  async deleteProduct(productInputs: productDeleteRequest) {
    const findProduct = await productModel.findOne({
      _id: productInputs._id,
      isDeleted: false,
    });
    console.log("findProduct", findProduct);
    if (findProduct) {
      // soft delete product
      const productResult = await productModel.updateOne(
        { _id: productInputs._id },
        { isDeleted: true }
      );
      // soft delete subproduct
      // const subproductResult = await subProductModel.updateMany({ productId: productInputs._id }, { isDeleted: true });
      // console.log("subproductResult", subproductResult)
      //create history
      const history = new historyModel({
        productId: productInputs._id,
        log: [
          {
            objectId: productInputs._id,
            userId: productInputs.userId,
            action: `productName = ${findProduct.name} deleted and subproduct also deleted`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();
      return FormateData({ message: "Product Deleted" });
    }
  }
}

export default ProductRepository;
