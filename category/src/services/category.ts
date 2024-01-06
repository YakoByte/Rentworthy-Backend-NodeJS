import categoryRepository from '../database/repository/category';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { categoryRequest, categoryUpdateRequest, categoryDeleteRequest, categoryGetRequest } from '../interface/category';
import category from '../api/category';

// All Business logic will be here
class categoryService {
    private repository: categoryRepository;

    constructor() {
        this.repository = new categoryRepository();
    }
    // create category
    async CreateCategory(categoryInputs: categoryRequest) {
        try {
            const existingCategory: any = await this.repository.CreateCategory(
                categoryInputs
            );

            return FormateData({ existingCategory });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // get category by id , search or all category
    async getCategory(categoryInputs: categoryGetRequest) {
        let page = categoryInputs.page ? Number(categoryInputs.page) * Number(categoryInputs.limit) - Number(categoryInputs.limit) : 0;
        let limit = categoryInputs.limit ? Number(categoryInputs.limit) : 10;
        try {
            let existingCategory: any
            if (categoryInputs._id) {
                existingCategory = await this.repository.getCategoryById(
                    { _id: categoryInputs._id }
                );
            } else if (categoryInputs.search) {
                existingCategory = await this.repository.getCategoryByName(
                    { name: categoryInputs.search }
                );
            } else {
                existingCategory = await this.repository.getAllCategory({
                    skip: page,
                    limit: limit
                });
            }

            return FormateData({ existingCategory });
        } catch (err: any) {
            console.log("service err", err)
            return FormateData({ message: "Data Not found", err });
        }
    }
    // update category
    async updateCategory(categoryInputs: categoryUpdateRequest) {
        try {
            const existingCategory: any = await this.repository.updateCategory(
                categoryInputs
            );

            return FormateData({ existingCategory });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // delete category
    async deleteCategory(categoryInputs: categoryDeleteRequest) {
        try {
            const existingCategory: any = await this.repository.deleteCategory(
                categoryInputs
            );

            return FormateData({ existingCategory });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

}

export = categoryService;
