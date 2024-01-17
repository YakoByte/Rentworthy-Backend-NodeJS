import productLikeRepository from '../database/repository/productlike';
import { productLikeRequest, getProductLikeRequest, getAllProductLike } from "../interface/productlike";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError, STATUS_CODES } from '../utils/app-error';


class productService {
    private repository: productLikeRepository;

    constructor() {
        this.repository = new productLikeRepository();
    }

    async CreateProductLike(productInputs: productLikeRequest) {
        try {
            const existingProduct: any = await this.repository.CreateProductLike(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async getProductlike(productInputs: getProductLikeRequest) {
        try {
            const existingProduct: any = await this.repository.GetProductLikes(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async getAllProductLike(productInputs: getAllProductLike) {
        try {
            const ProductLike: any = await this.repository.GetAllProductLike({
                productId: productInputs.productId || '',
                page: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
                limit: Number(productInputs.limit) || 10
            });

            return ProductLike;

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async getProductLikeCount(productInputs: getAllProductLike) {
        try {
            const LikeCount: any = await this.repository.GetLikeCount({
                productId: productInputs.productId || '',
            });

            return LikeCount;

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = productService;