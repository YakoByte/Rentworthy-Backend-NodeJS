import bookingRepository from '../database/repository/booking';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { bookingRequest, bookingUpdateRequest, bookingGetRequest, recentBookingGetRequest, bookingDeleteRequest, postAuthenticatedRequest, approveAuthenticatedRequest } from '../interface/booking';

// All Business logic will be here
class bookingService {
    private repository: bookingRepository;

    constructor() {
        this.repository = new bookingRepository();
    }
    // create booking
    async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
        try {
            console.log("bookingInputs", bookingInputs)
            const existingBooking: any = await this.repository.CreateBooking(
                bookingInputs,
                req
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
    // get recent booking 
    async getRecentBooking(bookingInputs: recentBookingGetRequest) {
        try {
            let existingBooking: any
            existingBooking = await this.repository.getRecentBooking(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

    // get booking by id , userId or all booking
    async getBooking(bookingInputs: bookingGetRequest) {
        try {
            let existingBooking: any
            existingBooking = await this.repository.getAllBooking(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to booking
    async addImagesToBooking(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.addImagesToBooking(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // remove images from booking
    async removeImagesFromBooking(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.removeImagesFromBooking(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // approve booking
    async approveBooking(bookingInputs: bookingUpdateRequest, req: approveAuthenticatedRequest) {
        try {
            let existingBooking: any
            if (bookingInputs.isAccepted === true) {
                existingBooking = await this.repository.approveBooking(
                    bookingInputs
                );
            } else {
                existingBooking = await this.repository.rejectBooking(
                    bookingInputs,
                    req
                );
            }

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update booking by id
    async updateBookingById(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.updateBookingById(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update preRentalScreening by id
    async updatePreRentalScreeningById(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.updatePreRentalScreeningByBookingId(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete booking by id  (soft delete)
    async deleteBooking(bookingInputs: bookingDeleteRequest) {
        try {
            const existingBooking: any = await this.repository.deleteBookingById(
                bookingInputs
            );

            return FormateData({ existingBooking });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = bookingService;
