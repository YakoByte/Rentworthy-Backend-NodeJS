import bannerRepository from '../database/repository/banner';
import { FormateData, FormateError } from '../utils';
import { bannerRequest, bannerUpdateRequest, bannerGetRequest, bannerDeleteRequest } from '../interface/banner';

// All Business logic will be here
class BannerService {
    private repository: bannerRepository;

    constructor() {
        this.repository = new bannerRepository();
    }
    // create Banner
    async CreateBanner(BannerInputs: bannerRequest) {
        try {
            const existingBanner: any = await this.repository.CreateBanner(
                BannerInputs
            );

            return FormateData(existingBanner);;
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Banner" });
        }
    }
    
    // get Banner by id
    async getBanner(BannerInputs: bannerGetRequest) {
        try {
            let existingBanner: any
            existingBanner = await this.repository.getBanner(
                BannerInputs
            );

            return FormateData(existingBanner);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Banner" });
        }
    }

    // add images to Banner
    async addImagesToBanner(BannerInputs: bannerUpdateRequest) {
        try {
            const existingBanner: any = await this.repository.addImagesToBanner(
                BannerInputs
            );

            return FormateData(existingBanner);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image Banner" });
        }
    }

    // update Banner by id
    async updateBannerById(BannerInputs: bannerUpdateRequest) {
        try {
            const existingBanner: any = await this.repository.updateBannerById(
                BannerInputs
            );

            return FormateData(existingBanner);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Banner" });
        }
    }

    // delete Banner by id  (soft delete)
    async deleteBanner(BannerInputs: bannerDeleteRequest) {
        try {
            const existingBanner: any = await this.repository.deleteBannerById(
                BannerInputs
            );

            return FormateData(existingBanner);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Banner" });
        }
    }
}

export = BannerService;
