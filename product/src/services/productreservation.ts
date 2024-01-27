import productreservationRepository from "../database/repository/productreservation";
import {
  productReservationRequest,
  updateProductReservation,
  getAvailables,
  AuthenticatedRequest,
} from "../interface/productreservation";
import { FormateData, FormateError } from "../utils";

class productReservationService {
  private repository: productreservationRepository;

  constructor() {
    this.repository = new productreservationRepository();
  }

  async CreateProductReservation(productInputs: productReservationRequest) {
    try {
      const existingProduct: any =
        await this.repository.CreateProductReservation(productInputs);

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Created" });
    }
  }

  async UpdateProductReservation(productInputs: updateProductReservation) {
    try {
      const existingProduct: any =
        await this.repository.UpdateProductReservation(productInputs);

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  async UpdateProductReservationSelf(productInputs: updateProductReservation) {
    try {
      const existingProduct: any =
        await this.repository.UpdateProductReservationSelf(productInputs);

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Updated" });
    }
  }

  async RelieveProductReservation(productInputs: updateProductReservation) {
    try {
      const existingProduct: any =
        await this.repository.relieveProductReservation(productInputs);

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Relieve" });
    }
  }

  async getProductAvailable(productInputs: getAvailables) {
    try {
      const existingProduct: any = await this.repository.GetAvailableDates(
        productInputs
      );

      return FormateData(existingProduct);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }
}

export = productReservationService;
