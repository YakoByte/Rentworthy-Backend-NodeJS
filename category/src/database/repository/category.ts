import { categoryModel, subCategoryModel, historyModel } from "../models";
import { Types } from 'mongoose';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { categoryRequest, categoryDeleteRequest, categoryUpdateRequest, categoryGetRequest } from "../../interface/category";
class CategoryRepository {
    //create category
    async CreateCategory(categoryInputs: categoryRequest) {
        try {
            const findCategory = await categoryModel.findOne({ name: categoryInputs.name });
            console.log("findCategory", findCategory)
            if (findCategory) {
                return FormateData({ id: findCategory._id, name: findCategory.name });
            }

            const category = new categoryModel(categoryInputs);
            const categoryResult = await category.save();
            console.log("categoryResult", categoryResult)
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
            console.log("history", history)

            return categoryResult;
        } catch (err) {
            console.log("err", err)
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create User"
            );
        }
    }
    //get category by id
    async getCategoryById(categoryInputs: { _id: string }) {
        // const findCategory = await categoryModel.findOne({ _id: categoryInputs._id, isDeleted: false, isActive: true }, { _id: 1, name: 1, description: 1, image: 1 });
        const findCategory = await categoryModel.aggregate([
            { $match: { _id: new Types.ObjectId(categoryInputs._id), isDeleted: false, isActive: true } },
            {
                $lookup: {
                    from: "images",
                    localField: "image",
                    foreignField: "_id",
                    pipeline: [{ $project: { path: 1, _id: 0 } }],
                    as: "image"
                }
            },
            { $unwind: "$image" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: "$image.path"
                }
            }
        ])
        console.log("findCategory", findCategory)
        if (findCategory) {
            return FormateData(findCategory);
        }
    }
    //get all category
    async getAllCategory({ skip, limit }: { skip: number, limit: number }) {
        const findCategory = await categoryModel.aggregate([
            { $match: { isDeleted: false, isActive: true } }, {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    pipeline: [{ $project: { path: 1, _id: 0 } }],
                    as: "images"
                }
            },
            { $unwind: "$images" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: "$images.path"
                }
            },
            { $skip: skip }, { $limit: limit }])
        console.log("findCategory", findCategory)
        if (findCategory) {
            return FormateData(findCategory);
        }
    }
    // get category by name and search using regex
    async getCategoryByName(categoryInputs: { name: string }) {
        // const findCategory = await categoryModel.find({ name: { $regex: categoryInputs.name, $options: 'i' }, isDeleted: false, isActive: true });
        const findCategory = await categoryModel.aggregate([
            { $match: { name: { $regex: categoryInputs.name, $options: 'i' }, isDeleted: false, isActive: true } }, {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    pipeline: [{ $project: { path: 1, _id: 0 } }],
                    as: "images"
                }
            },
            { $unwind: "$images" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: "$images.path"
                }
            },]);
        console.log("findCategory", findCategory)
        if (findCategory) {
            return FormateData(findCategory);
        }
    }
    //update category name, description, isActive, isShow, image
    async updateCategory(categoryInputs: categoryUpdateRequest) {
        const findCategory = await categoryModel.findOne({ _id: categoryInputs._id, isDeleted: false });
        console.log("findCategory", findCategory)
        if (findCategory) {
            const categoryResult = await categoryModel.updateOne({ _id: categoryInputs._id }, categoryInputs);
            console.log("categoryResult", categoryResult)
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
            return FormateData({ message: "Category Updated" });
        }
    }
    //delete category also delete his subcategory
    async deleteCategory(categoryInputs: categoryDeleteRequest) {
        const findCategory = await categoryModel.findOne({ _id: categoryInputs._id, isDeleted: false });
        console.log("findCategory", findCategory)
        if (findCategory) {
            // soft delete category
            const categoryResult = await categoryModel.updateOne({ _id: categoryInputs._id }, { isDeleted: true });
            // soft delete subcategory
            const subcategoryResult = await subCategoryModel.updateMany({ categoryId: categoryInputs._id }, { isDeleted: true });
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
            return FormateData({ message: "Category Deleted" });
        }
    }

}

export default CategoryRepository;
