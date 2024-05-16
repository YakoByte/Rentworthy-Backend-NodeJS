import RoleRepository from '../database/repository/role';
import { FormateData, FormateError } from '../utils';
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

            if(!existingRole) {
                throw Error('Failed to create the role');
            }

            return FormateData(existingRole);
        } catch (err: any) {
            return FormateError({ error: "Failed To Create Role" });
        }
    }

    // async roleValidation(roleName: string, roleId: string) {
    //     try {
    //         const existingRole: any = await this.repository.checkRole(
    //             roleName,
    //             roleId
    //         );

    //         return FormateData(existingRole);
    //     } catch (err: any) {
    //         throw new Error("Data Not found", err);
    //     }
    // }

}

export = RoleService;
