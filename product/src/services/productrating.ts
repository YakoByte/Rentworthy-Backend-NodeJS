import productratingRepository from "../database/repository/productrating";
import {
  productRatingRequest,
  getProductRatingRequest,
  AuthenticatedRequest,
  getAllProductRating,
} from "../interface/productrating";
import { FormateData, FormateError } from "../utils";

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

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Created" });
    }
  }

  async getProductRating(productInputs: getProductRatingRequest) {
    try {
      const existingProduct: any = await this.repository.GetProductRating(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  async getAllProductRating(productInputs: getAllProductRating) {
    try {
      const existingProduct: any = await this.repository.GetAllProductRating({
        productId: productInputs.productId || "",
        page:
          Number(productInputs.page) * Number(productInputs.limit) -
            Number(productInputs.limit) || 0,
        limit: Number(productInputs.limit) || 10,
      });

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  async getProductRatingCount(productInputs: getAllProductRating) {
    try {
      const RatingCount: any = await this.repository.GetRatingCount({
        productId: productInputs.productId || "",
      });

      return FormateData(RatingCount);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }
}

export = productService;
