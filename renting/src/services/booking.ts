import bookingRepository from '../database/repository/booking';
import { FormateData, FormateError } from '../utils';

import { bookingRequest, bookingUpdateRequest, bookingGetRequest, bookingDeleteRequest, postAuthenticatedRequest, approveAuthenticatedRequest, expendDate } from '../interface/booking';

// All Business logic will be here
class bookingService {
    private repository: bookingRepository;

    constructor() {
        this.repository = new bookingRepository();
    }
    // create booking
    async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
        try {
            const existingBooking: any = await this.repository.CreateBooking(
                bookingInputs,
                req
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            console.log(err);
            
            return FormateError({ error: "Failed to Create Booking" });
        }
    }

    // create expandDate
    async CreateExpandDate(bookingInputs: expendDate) {
        try {
            const existingExpandDate: any = await this.repository.CreateExpandDate(bookingInputs);
            
            return FormateData(existingExpandDate);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Expand Date" });
        }
    }
    
    // get recent booking 
    async getRecentBooking(bookingInputs: bookingGetRequest) {
        try {
            let existingBooking: any
            existingBooking = await this.repository.getRecentBooking(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Booking" });
        }
    }

    // get User product booking 
    async getUsersProductBooking(bookingInputs: bookingGetRequest) {
        try {
            let existingBooking: any
            existingBooking = await this.repository.getUsersProductBooking(bookingInputs);

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Booking" });
        }
    }

    // get booking by id , userId or all booking
    async getBooking(bookingInputs: bookingGetRequest) {
        try {
            let existingBooking: any
            existingBooking = await this.repository.getAllBooking(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Booking" });
        }
    }

    // add images to booking
    async addImagesToBooking(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.addImagesToBooking(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image to Booking" });
        }
    }

    // remove images from booking
    async removeImagesFromBooking(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.removeImagesFromBooking(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Remove Booking" });
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

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to approve Booking" });
        }
    }

    // update booking by id
    async updateBookingById(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.updateBookingById(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Booking" });
        }
    }

    // update booking by id
    async updateBookingReview(bookingInputs: bookingUpdateRequest) {
        try {
            const existingBooking: any = await this.repository.updateBookingReview(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Booking" });
        }
    }

    // update preRentalScreening by id
    async updatePreRentalScreeningById(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.updatePreRentalScreeningByBookingId(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to update pre rental Screening Booking" });
        }
    }

    // update postRentalScreening by id
    async updatePostRentalScreeningById(bookingInputs: bookingRequest) {
        try {
            const existingBooking: any = await this.repository.updatePostRentalScreeningByBookingId(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to update pre rental Screening Booking" });
        }
    }

    // delete booking by id  (soft delete)
    async deleteBooking(bookingInputs: bookingDeleteRequest) {
        try {
            const existingBooking: any = await this.repository.deleteBookingById(
                bookingInputs
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Booking" });
        }
    }

    // track booking by id
    async trackBooking(bookingInputs: bookingGetRequest) {
        try {
            const existingBooking: any = await this.repository.trackBooking({
                skip:
                    Number(bookingInputs.page) * Number(bookingInputs.limit) -
                    Number(bookingInputs.limit) || 0,
                limit: Number(bookingInputs.limit) || 10,
            });

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Booking" });
        }
    }

    // track booking by id
    async trackUserBooking(bookingInputs: bookingGetRequest) {
        try {
            const existingBooking: any = await this.repository.trackUserBooking({
                userId: bookingInputs.userId || "",
                skip:
                    Number(bookingInputs.page) * Number(bookingInputs.limit) -
                    Number(bookingInputs.limit) || 0,
                limit: Number(bookingInputs.limit) || 10,
            });

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Booking" });
        }
    }

    // track booking by id
    async trackBookingById(bookingInputs: bookingGetRequest) {
        try {
            const existingBooking: any = await this.repository.trackBookingById(
                {_id: bookingInputs._id || ''}
            );

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Booking" });
        }
    }

    async BlockedBooking(bookingId: string, reason: string) {
        try {
            const existingBooking = await this.repository.BlockedBooking(bookingId, reason);
            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }

    async UnBlockBooking(bookingId: string) {
        try {
            const existingBooking = await this.repository.UnBlockBooking(bookingId);
            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }

    //count booking
    async CountProductBooking(bookingInputs: { productId: string }) {
        try {
            const Booking: any = await this.repository.CountProductBooking(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async CountUserBooking(bookingInputs: { userId: string }) {
        try {
            const Booking: any = await this.repository.CountUserBooking(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async CountUsersProductBooking(bookingInputs: { userId: string }) {
        try {
            const Booking: any = await this.repository.CountUsersProductBooking(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async getProductPaymentSum(bookingInputs: { productId: string }) {
        try {
            const Booking: any = await this.repository.getProductPaymentSum(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async getUserIdPaymentSum(bookingInputs: { userId: string }) {
        try {
            const Booking: any = await this.repository.getUserIdPaymentSum(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async getOwnerPaymentSum(bookingInputs: { owner: string }) {
        try {
            const Booking: any = await this.repository.getOwnerPaymentSum(
                bookingInputs
            );

            return FormateData(Booking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Count Booking" });
        }
    }

    async dummyAPI() {
        try {
            const existingBooking: any = await this.repository.dummyAPI();

            return FormateData(existingBooking);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Booking" });
        }
    }
}

export = bookingService;
