import AdminRepository from '../database/repository/user';
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
import { userSignRequest, userLoginRequest, userSetPasswordRequest, socialUserSignRequest, socialUserLoginRequest } from '../interface/user';
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
            const updateUser = await this.repository.UpdateUser(existingAdmin._id, { os: userInputs.os as string });
            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);
            console.log("checkRole", checkRole)
            if (checkRole.data.message === "Invalid Role") {
                return FormateData({ message: "Invalid Role" });
            }
            //check bussiness type
            if (userInputs.bussinessType && existingAdmin.bussinessType !== userInputs.bussinessType) {
                return FormateData({ message: "Invalid Bussiness Type" });
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
                        userName: existingAdmin.userName,
                        roleName: existingAdmin.roleId.name,
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

    async SocialSignUp(userInputs: socialUserSignRequest) {
        try {
            const newUser: any = await this.repository.SocialCreateUser(
                userInputs
            );
            return FormateData(newUser);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

    async SocialSignIn(userInputs: socialUserLoginRequest) {
        // const { email, password } = userInputs;
        try {
            const existingAdmin = await this.repository.FindMe(userInputs);
            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);
            console.log("checkRole", checkRole)
            if (checkRole.data.message === "Invalid Role") {
                return FormateData({ message: "Invalid Role" });
            }

            //check bussiness type
            if (userInputs.bussinessType && existingAdmin.bussinessType !== userInputs.bussinessType) {
                return FormateData({ message: "Invalid Bussiness Type" });
            }
            if (userInputs.loginType && existingAdmin.loginType === userInputs.loginType) {
                const token = await GenerateSignature({
                    email: existingAdmin.email,
                    _id: existingAdmin._id,
                    userName: existingAdmin.userName,
                    roleName: existingAdmin.roleId.name,
                });

                return FormateData({ id: existingAdmin._id, token });
            }

            return FormateData({ message: "Invalid Credentials" });

        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    async expiryToken(token: string) {
        try {
            const decoded: any = jwt.verify(token, "your_secret_key_here"); // Replace 'your_secret_key_here' with your JWT secret

            // Check if the token is expired
            const isTokenExpired = Date.now() >= decoded.exp * 1000;

            if (isTokenExpired) {
                console.log("Token has expired.");
                return FormateData({ message: "Token has expired." });
                // return true;
            } else {
                console.log("Token is still valid.");
                return FormateData({ message: "Token is still valid." });
                // return false;
            }
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    async GetAllUsers() {
        try {
            const existingAdmin = await this.repository.FindAllUsers();
            return FormateData(existingAdmin);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get Windows, Android, iOS, Linux, Other all counts
    async GetCount() {
        try {
            const existingUser = await this.repository.getAllOsCount();
            return (existingUser);
        } catch (err: any) {
            return FormateData(err);
        }
    }
}

export = AdminService;
