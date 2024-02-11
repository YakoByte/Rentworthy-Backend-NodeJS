import { productModel, historyModel, Bookings, Wishlists } from "../models";
import { Types } from "mongoose";
import {
  productRequest,
  productDeleteRequest,
  productUpdateRequest,
  productSorting,
  productGetRequest,
} from "../../interface/product";
import productReservationService from "../../services/productreservation";
import { generatePresignedUrl } from "../../utils/aws";
const ResRepo = new productReservationService();

class ProductRepository {
  //create product
  async CreateProduct(productInputs: productRequest) {
    try {
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
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Product");
    }
  }

  async getProductApprovedById(productInputs: { _id: string }) {
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findProduct.length === 0) {
        return { message: "Product not found" };
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
        data: productData || [],
        bookingData: bookingData || [],
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
    }
  }

  //get product by id
  async getProductById(productInputs: { _id: string; userId: string }) {
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findProduct.length === 0) {
        return { message: "Product not found" };
      }

      await productModel.updateOne(
        { _id: productInputs._id },
        { $inc: { viewCount: 1 } }
      );

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
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
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
    }
  }

  // get product by subcategory id
  async getProductBySubCategoryId(productInputs: productGetRequest) {
    try {
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
    }
  }

  //get all product
  async getAllProduct({
    skip,
    limit,
    userId,
  }: {
    skip: number;
    limit: number;
    userId: string;
  }) {
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (userId) {
              wishlistData = await Wishlists.findOne({
                userId: userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
        { $sort: { price: productInputs.price === "asc" ? 1 : -1 } },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
    }
  }

  // get product by location
  async getProductByLocation(productInputs: {
    lat: number;
    long: number;
    userId: string;
  }) {
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
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
    }
  }

  // get product by name and search using regex
  async getProductByName(productInputs: { name: string; userId: string }) {
    try {
      const findProduct = await productModel.aggregate([
        {
          $match: {
            name: { $regex: productInputs.name, $options: "i" },
            isDeleted: false,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
            ],
            as: "userId",
          },
        },
      ]);

      const wishlistPromises = await Promise.all(
        findProduct.map(async (element) => {
          element.images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          });
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let productBooking = await Bookings.findOne({
              productId: element._id,
              endDate: {
                $gte: today,
              },
            }).select({
              _id: 1,
              startDate: 1,
              endDate: 1,
              quantity: 1,
              status: 1,
            });

            let wishlistData = null;

            if (productInputs.userId) {
              wishlistData = await Wishlists.findOne({
                userId: productInputs.userId,
                productIds: element._id,
              });
            }

            return { product: element, wishlistData, productBooking };
          } catch (error) {
            console.error(
              `Error processing wishlist for product ${element._id}: ${error}`
            );
            // Handle the error as needed
            return {
              product: element,
              wishlistData: null,
              productBooking: null,
            };
          }
        })
      );

      return {
        data: await Promise.all(wishlistPromises),
      };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Product");
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

        return { message: "Product Updated" };
      } else {
        return { message: "Product not found or already deleted" };
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update Product");
    }
  }

  async deleteProduct(productInputs: productDeleteRequest) {
    try {
      const findProduct = await productModel.findOne({
        _id: productInputs._id,
        isDeleted: false,
      });
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
        return { message: "Product Deleted" };
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update Product");
    }
  }
}

export default ProductRepository;
