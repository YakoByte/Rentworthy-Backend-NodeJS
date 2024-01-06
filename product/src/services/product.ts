import productRepository from '../database/repository/product';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError, STATUS_CODES } from '../utils/app-error';

import { productRequest, productUpdateRequest, productDeleteRequest, productGetRequest } from '../interface/product';
// import { NOTFOUND } from 'dns';

// All Business logic will be here
class productService {
    private repository: productRepository;

    constructor() {
        this.repository = new productRepository();
    }
    // create product   
    async CreateProduct(productInputs: productRequest) {
        try {
            const existingProduct: any = await this.repository.CreateProduct(
                productInputs
            );

            return FormateData({ existingProduct });
        } catch (err: any) {
            return { STATUS_CODE: STATUS_CODES.BAD_REQUEST, data: err.message }
        }
    }
    // get product by id , search or all product
    async getProduct(productInputs: productGetRequest) {
        try {
            let existingProduct: any
            if (productInputs._id) {
                existingProduct = await this.repository.getProductById(
                    { _id: productInputs._id }
                );
            } else if (productInputs.search) {
                existingProduct = await this.repository.getProductByName(
                    { name: productInputs.search }
                );
            } else if (productInputs.categoryId) {
                existingProduct = await this.repository.getProductByCategoryId(
                    { categoryId: productInputs.categoryId }
                );
            } else if (productInputs.subCategoryId) {
                existingProduct = await this.repository.getProductBySubCategoryId(
                    { subCategoryId: productInputs.subCategoryId }
                );
            } else if (productInputs.lat && productInputs.long) {
                existingProduct = await this.repository.getProductByLocation(
                    { lat: Number(productInputs.lat), long: Number(productInputs.long) }
                );
            } else if (productInputs.price) {
                existingProduct = await this.repository.getProductPriceSortingWise(
                    { price: productInputs.price }
                );
            } else {
                existingProduct = await this.repository.getAllProduct({
                    skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
                    limit: Number(productInputs.limit) || 10
                });
            }
            return existingProduct;
        } catch (err: any) {
            console.log("err", err.message)
            return new BadRequestError("Data Not found", err);
        }
    }
    // update product
    async updateProduct(productInputs: productUpdateRequest) {
        try {
            const existingProduct: any = await this.repository.updateProduct(
                productInputs
            );

            return FormateData({ existingProduct });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // approve product
    async approveProduct(productInputs: productUpdateRequest) {
        try {
            // check product is exist or not
            const existingProduct: any = await this.repository.getProductById(
                { _id: productInputs._id }
            );
            if (!existingProduct) {
                return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, message: "Product not found" })
            }
            // check product is already approved or not
            if (existingProduct.isVerified === "approved") {
                return ({ STATUS_CODE: STATUS_CODES.BAD_REQUEST, message: "Product already approved" })
            }
            // check product is already rejected or not
            if (existingProduct.isVerified === "rejected") {
                return ({ STATUS_CODE: STATUS_CODES.BAD_REQUEST, message: "Product already rejected" })
            }
            const updateProduct: any = await this.repository.updateProduct(
                productInputs
            );
            return updateProduct;
        }
        catch (err: any) {
            return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, data: err.message })
        }
    }


    // delete product
    async deleteProduct(productInputs: productDeleteRequest) {
        try {
            const existingProduct: any = await this.repository.deleteProduct(
                productInputs
            );

            return FormateData({ existingProduct });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

}

export = productService;
