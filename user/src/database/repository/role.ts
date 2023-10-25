import { roleModel, historyModel } from "../models";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { roleRequest } from "../../interface/role";
class RoleRepository {
    async CreateRole(roleInputs: roleRequest) {
        // try {
        const findRole = await roleModel.findOne({ name: roleInputs.name });
        console.log("findRole", findRole)
        if (findRole) {
            return FormateData({ id: findRole._id, name: findRole.name });
        }

        const role = new roleModel(roleInputs);
        const roleResult = await role.save();

        const history = new historyModel({
            roleId: roleResult._id,
            log: [
                {
                    objectId: roleResult._id,
                    action: `roleName = ${roleInputs.name} created`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();

        return roleResult;
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }

    async getRoleById(roleInputs: roleRequest) {
        const findRole = await roleModel.findOne({ _id: roleInputs._id });
        console.log("findRole", findRole)
        if (findRole) {
            return FormateData({ id: findRole._id, name: findRole.name });
        }
    }

}

export default RoleRepository;
