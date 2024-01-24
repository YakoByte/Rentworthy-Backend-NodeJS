import productLikeRepository from "../database/repository/productlike";
import {
  productLikeRequest,
  getProductLikeRequest,
  getAllProductLike,
} from "../interface/productlike";
import { FormateData, FormateError } from "../utils";

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

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Created" });
    }
  }

  async getProductlike(productInputs: getProductLikeRequest) {
    try {
      const existingProduct: any = await this.repository.GetProductLikes(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  async getAllProductLike(productInputs: getAllProductLike) {
    try {
      const ProductLike: any = await this.repository.GetAllProductLike({
        productId: productInputs.productId || "",
        page:
          Number(productInputs.page) * Number(productInputs.limit) -
            Number(productInputs.limit) || 0,
        limit: Number(productInputs.limit) || 10,
      });

      return FormateData(ProductLike);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  async getProductLikeCount(productInputs: getAllProductLike) {
    try {
      const LikeCount: any = await this.repository.GetLikeCount({
        productId: productInputs.productId || "",
      });

      return FormateData(LikeCount);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }
}

export = productService;
