import expandDateRepository from '../database/repository/expandDate';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { expandDateRequest, expandDateUpdateRequest, expandDateGetRequest, expandDateDeleteRequest } from '../interface/expandDate';

// All Business logic will be here
class expandDateService {
    private repository: expandDateRepository;

    constructor() {
        this.repository = new expandDateRepository();
    }
    // create expandDate
    async CreateExpandDate(expandDateInputs: expandDateRequest) {
        try {
            console.log("expandDateInputs", expandDateInputs)
            const existingExpandDate: any = await this.repository.CreateExpandDate(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
    // get expandDate by id , userId or all expandDate
    async getExpandDate(expandDateInputs: expandDateGetRequest) {
        try {
            let existingExpandDate: any
            existingExpandDate = await this.repository.getAllExpandDate(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to expandDate
    async addImagesToExpandDate(expandDateInputs: expandDateRequest) {
        try {
            const existingExpandDate: any = await this.repository.addImagesToExpandDate(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // remove images from expandDate
    async removeImagesFromExpandDate(expandDateInputs: expandDateRequest) {
        try {
            const existingExpandDate: any = await this.repository.removeImagesFromExpandDate(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // approve expandDate
    async approveExpandDate(expandDateInputs: expandDateUpdateRequest) {
        try {
            let existingExpandDate: any
            if (expandDateInputs.isAccepted === true) {
                existingExpandDate = await this.repository.approveExpandDate(
                    expandDateInputs
                );
            } else {
                existingExpandDate = await this.repository.rejectExpandDate(
                    expandDateInputs
                );
            }

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update expandDate by id
    async updateExpandDateById(expandDateInputs: expandDateRequest) {
        try {
            const existingExpandDate: any = await this.repository.updateExpandDateById(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete expandDate by id  (soft delete)
    async deleteExpandDate(expandDateInputs: expandDateDeleteRequest) {
        try {
            const existingExpandDate: any = await this.repository.deleteExpandDateById(
                expandDateInputs
            );

            return FormateData({ existingExpandDate });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = expandDateService;
