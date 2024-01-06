import RoleRepository from '../database/repository/role';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { roleRequest } from '../interface/role';

// All Business logic will be here
class RoleService {
    private repository: RoleRepository;

    constructor() {
        this.repository = new RoleRepository();
    }

    async CreateRole(roleInputs: roleRequest) {
        try {
            const existingRole: any = await this.repository.CreateRole(
                roleInputs
            );

            return FormateData({ existingRole });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // async roleValidation(roleName: string, roleId: string) {
    //     try {
    //         const existingRole: any = await this.repository.checkRole(
    //             roleName,
    //             roleId
    //         );

    //         return FormateData({ existingRole });
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }

}

export = RoleService;
