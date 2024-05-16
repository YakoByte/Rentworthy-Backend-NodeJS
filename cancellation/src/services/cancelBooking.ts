import cancelBookingRepository from '../database/repository/cancelBooking';
import { FormateData, FormateError } from '../utils';

import { cancelBookingRequest, cancelBookingUpdateRequest, cancelBookingGetRequest, cancelBookingApproveRequest,cancelBookingDeleteRequest } from '../interface/cancelBooking';

// All Business logic will be here
class cancelBookingService {
    private repository: cancelBookingRepository;

    constructor() {
        this.repository = new cancelBookingRepository();
    }
    
    // create cancelBooking
    async CreateCancelBooking(cancelBookingInputs: cancelBookingRequest) {
        try {
            const existingCancelBooking: any = await this.repository.CreateCancelBooking(
                cancelBookingInputs
            );

            return FormateData(existingCancelBooking);
        } catch (err: any) {
            console.log("err", err.message)
            return FormateError({ error: "Data not Created" });
        }
    }

    // get cancelBooking by id , userId or all cancelBooking
    async getCancelBooking(cancelBookingInputs: cancelBookingGetRequest) {
        try {
            let existingCancelBooking: any
            existingCancelBooking = await this.repository.getAllCancelBooking(
                cancelBookingInputs
            );

            return FormateData(existingCancelBooking);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not FOund" });
        }
    }

    // update cancelBooking by id
    async updateCancelBookingById(cancelBookingInputs: cancelBookingUpdateRequest) {
        try {
            const existingCancelBooking: any = await this.repository.updateCancelBookingById(
                cancelBookingInputs
            );

            return FormateData(existingCancelBooking);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not updated" });
        }
    }

    //  approve and reject cancelBooking
    async approveCancelBooking(cancelBookingInputs: cancelBookingApproveRequest) {
        try {
            const existingCancelBooking: any = await this.repository.updateCancelBookingById(
                cancelBookingInputs
            );

            return FormateData(existingCancelBooking);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not Approved" });
        }
    }

    // delete cancelBooking by id  (soft delete)
    async deleteCancelBooking(cancelBookingInputs: cancelBookingDeleteRequest) {
        try {
            const existingCancelBooking: any = await this.repository.deleteCancelBookingById(
                cancelBookingInputs
            );

            return FormateData(existingCancelBooking);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not Deleted" });
        }
    }

    async getCountOfCancellation(criteria: string) {
        try {
            if(criteria === 'month'){
                const CancelBooking: any = await this.repository.getCountOfCancellationPerMonth();
                
                return FormateData(CancelBooking);
            } else if(criteria === 'week') {
                const CancelBooking: any = await this.repository.getCountOfCancellationPerWeek();
                
                return FormateData(CancelBooking);
            }
            else {
                const CancelBooking: any = await this.repository.getCountOfCancellationPerDay();
                
                return FormateData(CancelBooking);
            }

        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Data not found" });
        }
    }

}

export = cancelBookingService;
