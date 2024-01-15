import productReviewRepository from '../database/repository/productreview';
import { productReviewRequest, getProductReviewRequest, AuthenticatedRequest } from "../interface/productreview";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError, STATUS_CODES } from '../utils/app-error';


class productService {
    private repository: productReviewRepository;

    constructor() {
        this.repository = new productReviewRepository();
    }

    async CreateProductReview(productInputs: any) {
        try {
            const existingProduct: any = await this.repository.CreateProductReview(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            return FormateData("Data Not found");
        }
    }

    async getProductReview(productInputs: getProductReviewRequest) {
        try {
            const existingProduct: any = await this.repository.GetProductReview(
                productInputs
            );

            return existingProduct;

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = productService;