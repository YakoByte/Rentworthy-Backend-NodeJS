import AdminRepository from '../database/repository/business';
import { FormateData, FormateError } from '../utils';
import { BusinessGetRequest, BusinessAppRequest, BusinessRequest } from '../interface/business';

// All Business logic will be here
class AdminService {
    // private admin repository: AdminRepository;
    private repository: AdminRepository;

    constructor() {
        this.repository = new AdminRepository();
    }

    async createBusiness(businessInputs: BusinessRequest) {
        // const { email, password } = userInputs;
        try {
            const existingBusiness: any = await this.repository.CreateBusiness(
                businessInputs
            );

            if(!existingBusiness){
                throw Error('Failed to Create Business');
            }

            return FormateData(existingBusiness);
        } catch (err: any) {
            return FormateError({ error:  "Failed to Create Business" });
        }
    }
    async approveRejectBusiness(businessInputs: BusinessAppRequest) {
        // const { email, password } = userInputs;
        try {
            const existingBusiness: any = await this.repository.ApproveRejectBusiness(
                businessInputs
            );

            if(!existingBusiness){
                throw Error(`Unable to approved/reject the Business`);
            }

            return FormateData(existingBusiness);

        } catch (err: any) {
            return FormateError({ error: "Unable to approved/reject the Business" });
        }
    }
    async getBusiness(businessInputs: BusinessGetRequest) {
        // const { email, password } = userInputs;
        try {
            const existingBusiness: any = await this.repository.GetBusiness(
                businessInputs
            );

            if(!existingBusiness){
                throw Error("No Business Found");
            }

            return FormateData(existingBusiness);

        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }
}

export = AdminService;
