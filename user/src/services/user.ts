import AdminRepository from '../database/repository/user';
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
import { userSignRequest, userLoginRequest, userSetPasswordRequest } from '../interface/user';
import { roleRequest } from '../interface/role';
import e from 'express';

// All Business logic will be here
class AdminService {
    // private admin repository: AdminRepository;
    private repository: AdminRepository;

    constructor() {
        this.repository = new AdminRepository();
    }

    async SignIn(userInputs: userLoginRequest) {
        // const { email, password } = userInputs;
        try {
            const existingAdmin = await this.repository.FindMe(userInputs);
            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);
            console.log("checkRole", checkRole)
            if (checkRole.data.message === "Invalid Role") {
                return FormateData({ message: "Invalid Role" });
            }
            if (existingAdmin) {
                const validPassword = await ValidatePassword(
                    userInputs.password,
                    existingAdmin?.password
                );
                if (validPassword) {
                    const token = await GenerateSignature({
                        email: existingAdmin.email,
                        _id: existingAdmin._id,
                    });

                    return FormateData({ id: existingAdmin._id, token });
                }
            }


            return FormateData({ message: "Invalid Credentials" });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async SignUp(userInputs: userSignRequest) {
        try {
            const newUser: any = await this.repository.CreateUser(
                userInputs
            );
            return FormateData(newUser);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

    async GetProfile(userId: string) {
        try {
            const existingAdmin = await this.repository.FindUserById(userId);
            return FormateData(existingAdmin);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    async ResetPassword(userInputs: userSetPasswordRequest) {
        try {
            console.log("userInputs", userInputs)
            let existingAdmin: any = await this.repository.FindUserById(userInputs._id);
            existingAdmin = existingAdmin.profileData;
            console.log("existingAdmin", existingAdmin)
            if (existingAdmin) {
                const salt = await GenerateSalt();
                const password = await GeneratePassword(userInputs.newPassword, salt);
                //compare old password
                const validPassword = await ValidatePassword(
                    userInputs.oldPassword,
                    existingAdmin.password
                );
                if (!validPassword) {
                    return FormateData({ message: "Old password is not correct" });
                }
                //old password and new password should not be same
                if (userInputs.oldPassword === userInputs.newPassword) {
                    return FormateData({ message: "Old password and new password should not be same" });
                }
                const updatedAdmin = await this.repository.UpdateUser(existingAdmin._id, {
                    password
                });
                return FormateData({ message: "Password updated successfully" });
            } else {
                return FormateData({ message: "Invalid Credentials" });
            }
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // sending password link
}

export = AdminService;
