import AdminRepository from '../database/repository/business';
import jwt from 'jsonwebtoken';
// import RoleRepository from '../database/repository/role';
// import {roleValidation} from '../';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';
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

            return existingBusiness;

        } catch (err: any) {
            return err
        }
    }
    async approveRejectBusiness(businessInputs: BusinessAppRequest) {
        // const { email, password } = userInputs;
        try {
            const existingBusiness: any = await this.repository.ApproveRejectBusiness(
                businessInputs
            );

            return existingBusiness;

        } catch (err: any) {
            return err
        }
    }
    async getBusiness(businessInputs: BusinessGetRequest) {
        // const { email, password } = userInputs;
        try {
            const existingBusiness: any = await this.repository.GetBusiness(
                businessInputs
            );

            return existingBusiness ;

        } catch (err: any) {
            return err
        }
    }
}

export = AdminService;
