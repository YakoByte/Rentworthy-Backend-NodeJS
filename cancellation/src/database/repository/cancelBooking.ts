import { cancelBookingModel, productModel, historyModel } from "../models";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils/index';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { cancelBookingRequest, cancelBookingGetRequest, cancelBookingUpdateRequest, cancelBookingApproveRequest, cancelBookingDeleteRequest } from "../../interface/cancelBooking";
class CancelBookingRepository {
    //create cancelBooking
    async CreateCancelBooking(cancelBookingInputs: cancelBookingRequest) {
        try {
            const cancelBooking = await cancelBookingModel.create(cancelBookingInputs);
            return FormateData(cancelBooking);
        } catch (err: any) {
            return FormateData(err);
        }
    }
    //get cancelBooking by id , all cancelBooking

    async getAllCancelBooking(cancelBookingInputs: cancelBookingGetRequest) {
        try {
            let cancelBooking: any
            if (cancelBookingInputs._id) {
                cancelBooking = await cancelBookingModel.findOne(
                    {
                        _id: cancelBookingInputs._id,
                        // isDeleted: false
                    });
            } else {
                cancelBooking = await cancelBookingModel.find(
                    {
                        ...cancelBookingInputs,
                        // isDeleted: false
                    });
            }
            return FormateData(cancelBooking);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    //update cancelBooking by id
    async updateCancelBookingById(cancelBookingInputs: cancelBookingUpdateRequest) {
        const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
            { _id: cancelBookingInputs._id, },
            { ...cancelBookingInputs },
            { new: true });
        if (cancelBookingResult) {
            return FormateData(cancelBookingResult);
        }
    }
    async approveCancelBookingById(cancelBookingInputs: cancelBookingApproveRequest) {
        const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
            { _id: cancelBookingInputs._id, },
            { ...cancelBookingInputs },
            { new: true });
        if (cancelBookingResult) {
            return FormateData(cancelBookingResult);
        }
    }
    //delete cancelBooking by id
    async deleteCancelBookingById(cancelBookingInputs: cancelBookingDeleteRequest) {
        const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
            { _id: cancelBookingInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (cancelBookingResult) {
            return FormateData(cancelBookingResult);
        }
    }
}

export default CancelBookingRepository;
