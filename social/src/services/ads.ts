import adsRepository from '../database/repository/ads';
import { FormateData, FormateError } from '../utils';

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

            return FormateData(existingAds);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create ads" });
        }
    }
    // get ads by id , userId or all ads
    async getAds(adsInputs: adsGetRequest) {
        try {
            let existingAds: any
            existingAds = await this.repository.getAllAds(
                adsInputs
            );

            return FormateData(existingAds);
        } catch (err: any) {
            return FormateError({ error: "Failed to get ads" });
        }
    }
    // add images to ads
    async addImagesToAds(adsInputs: adsRequest) {
        try {
            const existingAds: any = await this.repository.addImagesToAds(
                adsInputs
            );

            return FormateData(existingAds);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image ads" });
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

            return FormateData(existingAds);
        } catch (err: any) {
            console.log("err", err)
            return FormateError({ error: "Failed to approve ads" });
        }
    }
    // update ads by id
    async updateAdsById(adsInputs: adsRequest) {
        try {
            const existingAds: any = await this.repository.updateAdsById(
                adsInputs
            );

            return FormateData(existingAds);
        } catch (err: any) {
            return FormateError({ error: "Failed to update ads" });
        }
    }
    // delete ads by id  (soft delete)
    async deleteAds(adsInputs: adsDeleteRequest) {
        try {
            const existingAds: any = await this.repository.deleteAdsById(
                adsInputs
            );

            return FormateData(existingAds);
        } catch (err: any) {
            return FormateError({ error: "Failed to delete ads" });
        }
    }

}

export = adsService;
