import productreservationRepository from '../database/repository/productreservation';
import { productReservationRequest, updateProductReservation, getAvailables, AuthenticatedRequest } from "../interface/productreservation";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError, STATUS_CODES } from '../utils/app-error';


class productReservationService {
    private repository: productreservationRepository;

    constructor() {
        this.repository = new productreservationRepository();
    }

    async CreateProductReservation(productInputs: productReservationRequest) {
        try {
            const existingProduct: any = await this.repository.CreateProductReservation(
                productInputs,
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async UpdateProductReservation(productInputs: updateProductReservation) {
        try {
            const existingProduct: any = await this.repository.UpdateProductReservation(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async UpdateProductReservationSelf(productInputs: updateProductReservation) {
        try {
            const existingProduct: any = await this.repository.UpdateProductReservationSelf(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async RelieveProductReservation(productInputs: updateProductReservation) {
        try {
            const existingProduct: any = await this.repository.relieveProductReservation(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async getProductAvailable(productInputs: getAvailables) {
        try {
            const existingProduct: any = await this.repository.GetAvailableDates(
                productInputs
            );

            return FormateData({ existingProduct });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = productReservationService;