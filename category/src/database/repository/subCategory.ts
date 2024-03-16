import { subCategoryModel, historyModel, ProductModel } from "../models";
import { Types } from "mongoose";
import {
  subCategoryDeleteRequest,
  subCategoryRequest,
  subCategoryUpdateRequest,
} from "../../interface/subCategory";
import { generatePresignedUrl } from "../../utils/aws";

class SubCategoryRepository {
  //create subCategory
  async CreateSubCategory(subCategoryInputs: subCategoryRequest) {
    try {
      const findSubCategory = await subCategoryModel.findOne({
        name: subCategoryInputs.name,
      });

      if (findSubCategory) {
        return findSubCategory;
      }

      const subCategory = new subCategoryModel(subCategoryInputs);
      const subCategoryResult = await subCategory.save();

      const history = new historyModel({
        subCategoryId: subCategoryResult._id,
        log: [
          {
            objectId: subCategoryResult._id,
            userId: subCategoryInputs.userId,
            action: `subCategoryName = ${subCategoryInputs.name} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return subCategoryResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Category");
    }
  }

  //get subCategory by id
  async getSubCategoryById(subCategoryInputs: { _id: string }) {
    try {
      // const findSubCategory = await subCategoryModel.findOne({ _id: subCategoryInputs._id, isDeleted: false, isActive: true });
      const findSubCategory = await subCategoryModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(subCategoryInputs._id),
            isDeleted: false,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "image",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            category: "$category.name",
            description: 1,
            image: "$image.path",
          },
        },
      ]);

      if (findSubCategory) {
        await Promise.all(findSubCategory.map(async (category: any) => {
          if (category.image) {
            await Promise.all(category.image.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }
        }));
        return findSubCategory;
      }
      
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  // get subCategory by categoryId
  async getSubCategoryByCategoryId(subCategoryInputs: { categoryId: string }) {
    try {
      const findSubCategory = await subCategoryModel.aggregate([
        {
          $match: {
            categoryId: new Types.ObjectId(subCategoryInputs.categoryId),
            isDeleted: false,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "image",
          },
        },
      ]);

      if (findSubCategory) {
        await Promise.all(findSubCategory.map(async (category: any) => {
          if (category.image) {
            await Promise.all(category.image.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }
        }));
        return findSubCategory;
      }

      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  //get all subCategory
  async getAllSubCategory({ skip, limit }: { skip: number; limit: number }) {
    try {
      const findSubCategory = await subCategoryModel.aggregate([
        { $match: { isDeleted: false, isActive: true } },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "image",
          },
        },

        {
          $project: {
            _id: 1,
            name: 1,
            category: "$category.name",
            description: 1,
            image: "$image.path",
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      if (findSubCategory) {
        await Promise.all(findSubCategory.map(async (category: any) => {
          if (category.image) {
            await Promise.all(category.image.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }
        }));
        return findSubCategory;
      }

      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  // get subCategory by name and search using regex
  async getSubCategoryByName(subCategoryInputs: { name: string }) {
    try {
      const findSubCategory = await subCategoryModel.aggregate([
        {
          $match: {
            name: { $regex: subCategoryInputs.name, $options: "i" },
            isDeleted: false,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "image",
          },
        },
      ]);

      if (findSubCategory) {
        await Promise.all(findSubCategory.map(async (category: any) => {
          if (category.image) {
            await Promise.all(category.image.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }
        }));
        return findSubCategory;
      }
      
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  //update subCategory name, description, isActive, isShow, image
  async updateSubCategory(subCategoryInputs: subCategoryUpdateRequest) {
    try {
      const findSubCategory = await subCategoryModel.findOne({
        _id: new Types.ObjectId(subCategoryInputs._id),
        isDeleted: false,
        isActive: true,
      });

      if (findSubCategory) {
        const subCategoryResult = await subCategoryModel.updateOne(
          { _id: new Types.ObjectId(subCategoryInputs._id) },
          subCategoryInputs
        );

        const history = new historyModel({
          subCategoryId: subCategoryInputs._id,
          log: [
            {
              objectId: subCategoryInputs._id,
              userId: subCategoryInputs.userId,
              action: `subCategoryName = ${subCategoryInputs.name} updated`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return subCategoryResult;
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Update Category");
    }
  }

  //delete subCategory also delete his subCategory
  async deleteSubCategory(subCategoryInputs: subCategoryDeleteRequest) {
    try {
      const product = await ProductModel.find({subCategoryId: new Types.ObjectId(subCategoryInputs._id), isDeleted: false, isActive: true}) 
      if(product.length > 0) {
        return { message: "You can not Delete this sub-category as it is used in many product" };
      }

      const findSubCategory = await subCategoryModel.findOne({
        _id: new Types.ObjectId(subCategoryInputs._id),
      });
      if (findSubCategory) {
        // soft delete subCategory
        await subCategoryModel.updateOne(
          { _id: new Types.ObjectId(subCategoryInputs._id) },
          { isDeleted: true, isActive: false }
        );

        //create history
        const history = new historyModel({
          subCategoryId: subCategoryInputs._id,
          log: [
            {
              objectId: subCategoryInputs._id,
              userId: subCategoryInputs.userId,
              action: `subCategoryName = ${findSubCategory.name} deleted and subCategory also deleted`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return { message: "SubCategory Deleted" };
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Delete Category");
    }
  }
}

export default SubCategoryRepository;
