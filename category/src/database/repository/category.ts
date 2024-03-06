import { categoryModel, subCategoryModel, historyModel } from "../models";
import { Types } from "mongoose";

import {
  categoryRequest,
  categoryDeleteRequest,
  categoryUpdateRequest,
  categoryGetRequest,
} from "../../interface/category";
import { generatePresignedUrl } from "../../utils/aws";

class CategoryRepository {
  //create category
  async CreateCategory(categoryInputs: categoryRequest) {
    try {
      const findCategory = await categoryModel.findOne({
        name: categoryInputs.name,
      });

      if (findCategory) {
        return { id: findCategory._id, name: findCategory.name };
      }

      const category = new categoryModel(categoryInputs);
      const categoryResult = await category.save();

      const history = new historyModel({
        categoryId: categoryResult._id,
        log: [
          {
            objectId: categoryResult._id,
            data: {
              userId: categoryInputs.userId,
            },
            action: `categoryName = ${categoryInputs.name} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return categoryResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Category");
    }
  }

  //get category by id
  async getCategoryById(categoryInputs: { _id: string }) {
    try {
      const findCategory = await categoryModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(categoryInputs._id),
            isDeleted: false,
            isActive: true,
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

      if (findCategory) {
        for (const category of findCategory) {
          if(category.image){
            category.image.forEach(async(element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                category.image.path = newPath;
              });
          }
        }
        return findCategory;
      }

      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  //get all category
  async getAllCategory({ skip, limit }: { skip: number; limit: number }) {
    try {      
      const findCategory = await categoryModel.aggregate([
        { $match: { isDeleted: false, isActive: true } },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "image",
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      if (findCategory) {
        for (const category of findCategory) {
          if(category.image){
            category.image.forEach(async(element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                category.image.path = newPath;
              });
          }
        }
        return findCategory;
      }

      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  // get category by name and search using regex
  async getCategoryByName(categoryInputs: { name: string }) {
    try {
      // const findCategory = await categoryModel.find({ name: { $regex: categoryInputs.name, $options: 'i' }, isDeleted: false, isActive: true });
      const findCategory = await categoryModel.aggregate([
        {
          $match: {
            name: { $regex: categoryInputs.name, $options: "i" },
            isDeleted: false,
            isActive: true,
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

      if (findCategory) {
        for (const category of findCategory) {
          if(category.image){
            category.image.forEach(async(element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                category.image.path = newPath;
              });
          }
        }
        return findCategory;
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Category");
    }
  }

  //update category name, description, isActive, isShow, image
  async updateCategory(categoryInputs: categoryUpdateRequest) {
    try {
      const findCategory = await categoryModel.findOne({
        _id: categoryInputs._id,
        isDeleted: false,
      });
      console.log("findCategory", findCategory);
      if (findCategory) {
        const categoryResult = await categoryModel.updateOne(
          { _id: categoryInputs._id },
          categoryInputs
        );
        console.log("categoryResult", categoryResult);
        const history = new historyModel({
          categoryId: categoryInputs._id,
          log: [
            {
              objectId: categoryInputs._id,
              userId: categoryInputs.userId,
              action: `categoryName = ${categoryInputs.name} updated`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return { message: "Category Updated" };
      }

      return { message: "Category Not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to update Category");
    }
  }

  //delete category also delete his subcategory
  async deleteCategory(categoryInputs: categoryDeleteRequest) {
    try {
      const findCategory = await categoryModel.findOne({
        _id: categoryInputs._id,
        isDeleted: false,
      });

      if (findCategory) {
        // soft delete category
        const categoryResult = await categoryModel.updateOne(
          { _id: categoryInputs._id },
          { isDeleted: true, isActive: false }
        );
        // soft delete subcategory
        const subcategoryResult = await subCategoryModel.updateMany(
          { categoryId: categoryInputs._id },
          { isDeleted: true, isActive: false }
        );
        // console.log("subcategoryResult", subcategoryResult)
        //create history
        const history = new historyModel({
          categoryId: categoryInputs._id,
          log: [
            {
              objectId: categoryInputs._id,
              userId: categoryInputs.userId,
              action: `categoryName = ${findCategory.name} deleted and subcategory also deleted`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();
        return { message: "Category Deleted" };
      }
      return { message: "Category Not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Delete Category");
    }
  }
}

export default CategoryRepository;
