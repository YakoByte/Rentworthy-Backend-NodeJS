import subCategoryRepository from '../database/repository/subCategory';
import { FormateData, FormateError } from '../utils';

import { subCategoryRequest, subCategoryGetRequest, subCategoryDeleteRequest, subCategoryUpdateRequest } from '../interface/subCategory';

// All Business logic will be here
class subCategoryService {
    private repository: subCategoryRepository;

    constructor() {
        this.repository = new subCategoryRepository();
    }
    // create subCategory
    async CreateSubCategory(subCategoryInputs: subCategoryRequest) {
        try {
            const existingSubCategory: any = await this.repository.CreateSubCategory(
                subCategoryInputs
            );

            return FormateData(existingSubCategory);
        } catch (err: any) {
            return FormateError({ error: "Data not Created" });
        }
    }
    // get subCategory by id , name or all subCategory
    async getSubCategory(subCategoryInputs: subCategoryGetRequest) {
        try {
            subCategoryInputs.page = subCategoryInputs.page ? (Number(subCategoryInputs.page) * Number(subCategoryInputs.limit) - Number(subCategoryInputs.limit)).toString() : '0';
            subCategoryInputs.limit = subCategoryInputs.limit ? Number(subCategoryInputs.limit).toString() : '10';
            let existingSubCategory: any
            if (subCategoryInputs._id) {
                existingSubCategory = await this.repository.getSubCategoryById(
                    { _id: subCategoryInputs._id }
                );
            } else if (subCategoryInputs.search) {
                existingSubCategory = await this.repository.getSubCategoryByName(
                    { name: subCategoryInputs.search }
                );
            } else if (subCategoryInputs.categoryId) {
                existingSubCategory = await this.repository.getSubCategoryByCategoryId(
                    subCategoryInputs
                );
            } else {
                existingSubCategory = await this.repository.getAllSubCategory(
                    subCategoryInputs
                );
            }

            return FormateData(existingSubCategory);
        } catch (err: any) {
            return FormateError({ error: "Data not found" });
        }
    }
    // update subCategory
    async updateSubCategory(subCategoryInputs: subCategoryUpdateRequest) {
        try {
            const existingSubCategory: any = await this.repository.updateSubCategory(
                subCategoryInputs
            );

            return FormateData(existingSubCategory);
        } catch (err: any) {
            return FormateError({ error: "Data not Udated" });
        }
    }

    //delete subCategory
    async deleteSubCategory(subCategoryInputs: subCategoryDeleteRequest) {
        try {
            const existingSubCategory: any = await this.repository.deleteSubCategory(
                subCategoryInputs
            );

            return FormateData(existingSubCategory);
        } catch (err: any) {
            return FormateError({ error: "Data not Deleted" });
        }
    }

}

export = subCategoryService;
