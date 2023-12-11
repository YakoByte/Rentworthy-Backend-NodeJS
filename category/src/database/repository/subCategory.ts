import { subCategoryModel, historyModel } from "../models";
import ObjectId from "mongoose";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { subCategoryDeleteRequest, subCategoryRequest, subCategoryGetRequest, subCategoryUpdateRequest } from "../../interface/subCategory";
class SubCategoryRepository {
    //create subCategory
    async CreateSubCategory(subCategoryInputs: subCategoryRequest) {
        // try {
        const findSubCategory = await subCategoryModel.findOne({ name: subCategoryInputs.name });
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            return FormateData({ id: findSubCategory._id, name: findSubCategory.name });
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
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }
    //get subCategory by id
    async getSubCategoryById(subCategoryInputs: { _id: string }) {
        const findSubCategory = await subCategoryModel.findOne({ _id: subCategoryInputs._id, isDeleted: false, isActive: true });
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            return FormateData(findSubCategory);
        }
    }
    // get subCategory by categoryId
    async getSubCategoryByCategoryId(subCategoryInputs: subCategoryGetRequest) {
        const findSubCategory =
            await subCategoryModel
                .find({ categoryId: subCategoryInputs.categoryId, isDeleted: false, isActive: true })
                .skip(Number(subCategoryInputs.page))
                .limit(Number(subCategoryInputs.limit));
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            return FormateData(findSubCategory);
        }
    }
    //get all subCategory
    async getAllSubCategory(subCategoryInputs: subCategoryGetRequest) {
        const findSubCategory =
            await subCategoryModel
                .find({ isDeleted: false, isActive: true })
                .skip(Number(subCategoryInputs.page))
                .limit(Number(subCategoryInputs.limit));
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            return FormateData(findSubCategory);
        }
    }
    // get subCategory by name and search using regex
    async getSubCategoryByName(subCategoryInputs: { name: string }) {
        const findSubCategory = await subCategoryModel.find({ name: { $regex: subCategoryInputs.name, $options: 'i' }, isDeleted: false, isActive: true });
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            return FormateData(findSubCategory);
        }
    }
    //update subCategory name, description, isActive, isShow, image
    async updateSubCategory(subCategoryInputs: subCategoryUpdateRequest) {
        const findSubCategory = await subCategoryModel.findOne({ _id: subCategoryInputs._id, isDeleted: false, isActive: true });
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            const subCategoryResult = await subCategoryModel.updateOne({ _id: subCategoryInputs._id }, subCategoryInputs);
            console.log("subCategoryResult", subCategoryResult)
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
            return FormateData({ message: "SubCategory Updated" });
        }
    }
    //delete subCategory also delete his subCategory
    async deleteSubCategory(subCategoryInputs: subCategoryDeleteRequest) {
        const findSubCategory = await subCategoryModel.findOne({ _id: subCategoryInputs._id });
        console.log("findSubCategory", findSubCategory)
        if (findSubCategory) {
            // soft delete subCategory
            const subCategoryResult = await subCategoryModel.updateOne({ _id: subCategoryInputs._id }, { isDeleted: true });
            // console.log("subCategoryResult", subCategoryResult)
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
            return FormateData({ message: "SubCategory Deleted" });
        }
    }

}

export default SubCategoryRepository;
