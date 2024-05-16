import productReviewRepository from '../database/repository/productreview';
import { productReviewRequest, getProductReviewRequest, AuthenticatedRequest, getAllProductReview } from "../interface/productreview";
import { FormateData, FormateError } from '../utils';

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

            return FormateData(existingProduct);

        } catch (err: any) {
            return FormateData("Data Not Created");
        }
    }

    async getProductReview(productInputs: getProductReviewRequest) {
        try {
            const existingProduct: any = await this.repository.GetProductReview(
                productInputs
            );

            return FormateData(existingProduct);

        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }

    async getAllProductReview(productInputs: getAllProductReview) {
        try {
            const existingProduct: any = await this.repository.GetAllProductReview({
                productId: productInputs.productId || '',
                page: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
                limit: Number(productInputs.limit) || 10
            });

            return FormateData(existingProduct);

        } catch (err: any) {
            return FormateError({ error: "Data not Found" });
        }
    }
}

export = productService;