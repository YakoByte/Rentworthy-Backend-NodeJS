import cancelBookingRepository from '../database/repository/cancelBooking';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { cancelBookingRequest, cancelBookingUpdateRequest, cancelBookingGetRequest, cancelBookingDeleteRequest } from '../interface/cancelBooking';

// All Business logic will be here
class cancelBookingService {
    private repository: cancelBookingRepository;

    constructor() {
        this.repository = new cancelBookingRepository();
    }
    // create cancelBooking
    async CreateCancelBooking(cancelBookingInputs: cancelBookingRequest) {
        try {
            console.log("cancelBookingInputs", cancelBookingInputs)
            const existingCancelBooking: any = await this.repository.CreateCancelBooking(
                cancelBookingInputs
            );

            return FormateData({ existingCancelBooking });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
    // get cancelBooking by id , userId or all cancelBooking
    async getCancelBooking(cancelBookingInputs: cancelBookingGetRequest) {
        try {
            let existingCancelBooking: any
            existingCancelBooking = await this.repository.getAllCancelBooking(
                cancelBookingInputs
            );

            return FormateData({ existingCancelBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update cancelBooking by id
    async updateCancelBookingById(cancelBookingInputs: cancelBookingUpdateRequest) {
        try {
            const existingCancelBooking: any = await this.repository.updateCancelBookingById(
                cancelBookingInputs
            );

            return FormateData({ existingCancelBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //  approve and reject cancelBooking
    async approveCancelBooking(cancelBookingInputs: cancelBookingUpdateRequest) {
        try {
            const existingCancelBooking: any = await this.repository.updateCancelBookingById(
                cancelBookingInputs
            );

            return FormateData({ existingCancelBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete cancelBooking by id  (soft delete)
    async deleteCancelBooking(cancelBookingInputs: cancelBookingDeleteRequest) {
        try {
            const existingCancelBooking: any = await this.repository.deleteCancelBookingById(
                cancelBookingInputs
            );

            return FormateData({ existingCancelBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = cancelBookingService;
