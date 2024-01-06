import adsRepository from '../database/repository/ads';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { adsRequest, adsUpdateRequest, adsGetRequest, adsDeleteRequest } from '../interface/ads';

// All Business logic will be here
class adsService {
    private repository: adsRepository;

    constructor() {
        this.repository = new adsRepository();
    }
    // create ads
    async CreateAds(adsInputs: adsRequest) {
        try {
            console.log("adsInputs", adsInputs)
            const existingAds: any = await this.repository.CreateAds(
                adsInputs
            );

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err.message)
            return ({ message: "Data Not found", err });
        }
    }
    // get ads by id , userId or all ads
    async getAds(adsInputs: adsGetRequest) {
        try {
            let existingAds: any
            existingAds = await this.repository.getAllAds(
                adsInputs
            );

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to ads
    async addImagesToAds(adsInputs: adsRequest) {
        try {
            const existingAds: any = await this.repository.addImagesToAds(
                adsInputs
            );

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // approve ads
    async approveAds(adsInputs: adsUpdateRequest) {
        try {
            let existingAds: any
            if (adsInputs.isApproved === true) {
                existingAds = await this.repository.approveAds(
                    adsInputs
                );
            } else {
                existingAds = await this.repository.rejectAds(
                    adsInputs
                );
            }

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update ads by id
    async updateAdsById(adsInputs: adsRequest) {
        try {
            const existingAds: any = await this.repository.updateAdsById(
                adsInputs
            );

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete ads by id  (soft delete)
    async deleteAds(adsInputs: adsDeleteRequest) {
        try {
            const existingAds: any = await this.repository.deleteAdsById(
                adsInputs
            );

            return FormateData({ existingAds });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = adsService;
