import productRepository from "../database/repository/product";
import { FormateData, FormateError } from "../utils";

import {
  productRequest,
  productUpdateRequest,
  productDeleteRequest,
  productGetRequest,
} from "../interface/product";

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

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log(err)
      return FormateError({ error: "Data not Created" });
    }
  }

  // create product
  async AddNoAvailableDates(productInputs: productRequest) {
    try {
      const existingProduct: any = await this.repository.AddNoAvailableDates(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log(err)
      return FormateError({ error: "Data not Created" });
    }
  }

  // create product
  async RemoveNoAvailableDates(productInputs: productRequest) {
    try {
      const existingProduct: any = await this.repository.RemoveNoAvailableDates(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log(err)
      return FormateError({ error: "Data not Created" });
    }
  }

  // get product by id , search or all product
  async getAdminProduct(productInputs: productGetRequest) {
    try {            
      let existingProduct: any;
      if (productInputs.price) {
        existingProduct = await this.repository.getProductPriceSortingWise({
          price: productInputs.price,
          skip:
            Number(productInputs.page) * Number(productInputs.limit) -
              Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          _id: productInputs?._id,
          userId: productInputs?.userId,
          ownerId: productInputs?.ownerId,
          search: productInputs?.search,
          categoryId: productInputs?.categoryId,
          subCategoryId: productInputs?.subCategoryId,
          lat: productInputs?.lat,
          long: productInputs?.long,
        });
      } else if (productInputs.isPending) {
        existingProduct = await this.repository.getProductToApprove({
          skip:
            Number(productInputs.page) * Number(productInputs.limit) -
              Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
        });
      } else if (productInputs.isRejected) {
        existingProduct = await this.repository.getRejectedProduct({
          skip:
            Number(productInputs.page) * Number(productInputs.limit) -
              Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
        });
      } else if (productInputs.isVerified) {
        existingProduct = await this.repository.getAllProduct({
          skip:
            Number(productInputs.page) * Number(productInputs.limit) -
              Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.userId || "",
        });
      } else if (productInputs._id) {
        existingProduct = await this.repository.getProductById({
          _id: productInputs._id,
          userId: productInputs.userId || "",
        });
      } else if (productInputs.ownerId) {
        existingProduct = await this.repository.getProductByUserId({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.ownerId || '',
        });
      } else if (productInputs.search) {
        existingProduct = await this.repository.getProductByName({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          name: productInputs.search,
          userId: productInputs.userId || "",
        });
      } else if (productInputs.categoryId) {
        existingProduct = await this.repository.getProductByCategoryId({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          categoryId: productInputs.categoryId,
          userId: productInputs.userId || "",
        });
      } else if (productInputs.subCategoryId) {
        existingProduct = await this.repository.getProductBySubCategoryId({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          subCategoryId: productInputs.subCategoryId,
          userId: productInputs.userId || "",
        });
      } else if (productInputs.lat && productInputs.long) {
        existingProduct = await this.repository.getProductByLocation({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          lat: Number(productInputs.lat),
          long: Number(productInputs.long),
          userId: productInputs.userId || "",
        });
      } else if (productInputs.isDeliverable) {
        existingProduct = await this.repository.getDelivereableProduct({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.userId || "",
        });
      } else if (productInputs.isPickUp) {
        existingProduct = await this.repository.getPickUpProduct({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.userId || "",
        });
      } else {
        existingProduct = await this.repository.getAllProduct({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.userId || "",
        });
      }

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }

  // get all product
  async getProduct(productInputs: productGetRequest) {
    try {            
      let existingProduct: any;
      if (productInputs.price) {
        existingProduct = await this.repository.getProductPriceSortingWise({
          price: productInputs.price,
          skip:
            Number(productInputs.page) * Number(productInputs.limit) -
              Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          _id: productInputs?._id,
          userId: productInputs?.userId,
          ownerId: productInputs?.ownerId,
          search: productInputs?.search,
          categoryId: productInputs?.categoryId,
          subCategoryId: productInputs?.subCategoryId,
          lat: productInputs?.lat,
          long: productInputs?.long,
        });
      } else if (productInputs.lat && productInputs.long) {
        existingProduct = await this.repository.getProductByLocation({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          lat: Number(productInputs.lat),
          long: Number(productInputs.long),
          userId: productInputs.userId || "",
        });
      } else {
        existingProduct = await this.repository.getProduct({
          ...productInputs,
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
        });
      }

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }

  // update product
  async updateProduct(productInputs: productUpdateRequest) {
    try {
      const existingProduct: any = await this.repository.updateProduct(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Updated" });
    }
  }

  // approve product
  async approveProduct(productInputs: productUpdateRequest) {
    try {      
      // check product is exist or not
      const existingProduct: any = await this.repository.getProductApprovedById(
        { _id: productInputs._id }
      );
      
      if (!existingProduct) {
        return FormateData({ message: "Product not found" });
      }
      // check product is already approved or not
      if (existingProduct[0].isVerified === "approved") {
        return FormateData({ message: "Product already approved" });
      }
      // check product is already rejected or not
      if (existingProduct[0].isVerified === "rejected") {
        return FormateData({ message: "Product already rejected" });
      }
      const updateProduct: any = await this.repository.updateProduct(
        productInputs
      );

      if(productInputs.isVerified === "rejected") {
        await this.repository.deleteProduct({ _id: productInputs._id, userId: productInputs.userId });
      }

      return FormateData(updateProduct);
    } catch (error: any) {
      console.log(error);
      
      return FormateError({ error: "Data not approved / rejected" });
    }
  }

  // delete product
  async deleteProduct(productInputs: productDeleteRequest) {
    try {
      const existingProduct: any = await this.repository.deleteProduct(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Deleted" });
    }
  }

  // get product by userId
  async getProductByUserId(productInputs: productGetRequest) {
    try {
      let existingProduct = await this.repository.getProductByUserId({
          skip: Number(productInputs.page) * Number(productInputs.limit) - Number(productInputs.limit) || 0,
          limit: Number(productInputs.limit) || 10,
          userId: productInputs.userId || '',
        });

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }

  // get product by MaximumCount
  async MaximumCountProduct() {
    try {
      let existingProduct = await this.repository.MaximumCountProduct();

      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }

  async UserProductView(userId: string) {
    try {
      let existingProduct = await this.repository.UserProductView({userId});
      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }

  async ProductView(_id: string) {
    try {
      let existingProduct = await this.repository.ProductView({_id});
      return FormateData(existingProduct);
    } catch (err: any) {
      console.log("err", err.message);
      return FormateError({ error: "Data not Found" });
    }
  }
}

export = productService;
