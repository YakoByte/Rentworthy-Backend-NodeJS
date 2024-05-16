import adminADSRepository from '../database/repository/adminADS';
import { FormateData, FormateError } from '../utils';

import { adminADSRequest, adminADSUpdateRequest, adminADSGetRequest, adminADSDeleteRequest } from '../interface/adminADS';

// All Business logic will be here
class AdminADSService {
    private repository: adminADSRepository;

    constructor() {
        this.repository = new adminADSRepository();
    }
    // create adminADS
    async CreateAdminADS(adminADSInputs: adminADSRequest) {
        try {
            const existingadminADS: any = await this.repository.CreateAdminADS(
                adminADSInputs
            );

            return FormateData(existingadminADS);;
        } catch (err: any) {
            return FormateError({ error: "Failed to Create adminADS" });
        }
    }
    
    // get adminADS by id
    async getAdminADS(adminADSInputs: adminADSGetRequest) {
        try {
            let existingadminADS: any
            existingadminADS = await this.repository.getAdminADS(
                adminADSInputs
            );

            return FormateData(existingadminADS);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get adminADS" });
        }
    }

    // add images to adminADS
    async addImagesToAdminADS(adminADSInputs: adminADSUpdateRequest) {
        try {
            const existingadminADS: any = await this.repository.addImagesToAdminADS(
                adminADSInputs
            );

            return FormateData(existingadminADS);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image adminADS" });
        }
    }

    // update adminADS by id
    async updateAdminADSById(adminADSInputs: adminADSUpdateRequest) {
        try {
            const existingadminADS: any = await this.repository.updateAdminADSById(
                adminADSInputs
            );

            return FormateData(existingadminADS);
        } catch (err: any) {
            return FormateError({ error: "Failed to update adminADS" });
        }
    }

    // delete adminADS by id  (soft delete)
    async deleteAdminADS(adminADSInputs: adminADSDeleteRequest) {
        try {
            const existingadminADS: any = await this.repository.deleteAdminADSById(
                adminADSInputs
            );

            return FormateData(existingadminADS);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete adminADS" });
        }
    }
}

export = AdminADSService;
