import productratingRepository from '../database/repository/productrating';
import { productRatingRequest, getProductRatingRequest, AuthenticatedRequest } from "../interface/productrating";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError, STATUS_CODES } from '../utils/app-error';


class productService {
    private repository: productratingRepository;

    constructor() {
        this.repository = new productratingRepository();
    }

    async CreateProductRating(productInputs: any) {
        try {
            const existingProduct: any = await this.repository.CreateProductRating(
                productInputs
            );

            return FormateData( existingProduct );

        } catch (err: any) {
            return FormateData("Data Not found");
        }
    }

    async getProductRating(productInputs: getProductRatingRequest) {
        try {
            const existingProduct: any = await this.repository.GetProductRating(
                productInputs
            );

            return FormateData(existingProduct);

        } catch (err: any) {
            return FormateData("Data Not found");
        }
    }
}

export = productService;