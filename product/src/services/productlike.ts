import productLikeRepository from '../database/repository/productlike';
import { productLikeRequest, getProductLikeRequest } from "../interface/productlike";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
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
}

export = productService;