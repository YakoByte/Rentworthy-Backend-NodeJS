import productratingRepository from '../database/repository/productrating';
import { productRatingRequest, getProductRatingRequest, AuthenticatedRequest, getAllProductRating } from "../interface/productrating";
import { FormateData } from '../utils';
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

    async getAllProductRating(productInputs: getAllProductRating) {
        try {
            const existingProduct: any = await this.repository.GetAllProductRating({
                productId: productInputs.productId || '',
                page: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
                limit: Number(productInputs.limit) || 10
            });

            return existingProduct;

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async getProductRatingCount(productInputs: getAllProductRating) {
        try {
            const RatingCount: any = await this.repository.GetRatingCount({
                productId: productInputs.productId || '',
            });

            return RatingCount;

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = productService;