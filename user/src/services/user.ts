import AdminRepository from '../database/repository/user';
import jwt from 'jsonwebtoken';
import {
    FormateData,
    FormateError,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { userSignRequest, userLoginRequest, userSetPasswordRequest, socialUserSignRequest, socialUserLoginRequest } from '../interface/user';

// All Business logic will be here
class AdminService {
    // private admin repository: AdminRepository;
    private repository: AdminRepository;

    constructor() {
        this.repository = new AdminRepository();
    }

    async SignIn(userInputs: userLoginRequest) {
        try {
            const existingAdmin = await this.repository.FindMe(userInputs);
            const updateUser = await this.repository.UpdateUser(existingAdmin._id, { os: userInputs.os as string });
            
            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);
            console.log("checkRole", checkRole)
            if (checkRole === false) {
                return FormateError({ error: "Invalid Role" });
            }

            //check bussiness type
            if (userInputs.bussinessType && existingAdmin.bussinessType !== userInputs.bussinessType) {
                return FormateError({ error: "Invalid Bussiness Type" });
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

                    return FormateData({ id: existingAdmin._id, token, existingAdmin });
                }
            }


            return FormateError({ error: "Invalid Credentials" });

        } catch (err: any) {
            return FormateError({ error: "Creation Failed" });
        }
    }

    async SignUp(userInputs: userSignRequest) {
        try {
            const newUser: any = await this.repository.CreateUser(
                userInputs
            );

            if(newUser === true) {
                return FormateError({ error: "User already exist" })
            }

            if(!newUser) {
                throw FormateError({error: "Something went wrong"});
            }

            return FormateData(newUser);
        } catch (err: any) {
            return FormateError({ error: "Creation Failed" });
        }
    }

    async BlockedUser(userId: string) {
        try {
            const existingAdmin = await this.repository.BlockedUser(userId);
            return FormateData(existingAdmin);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }

    async UnBlockUser(userId: string) {
        try {
            const existingAdmin = await this.repository.UnBlockedUser(userId);
            return FormateData(existingAdmin);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }

    async GetProfile(userId: string) {
        try {
            const existingAdmin = await this.repository.FindUserById(userId);
            return FormateData(existingAdmin);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }
    
    async ResetPassword(userInputs: userSetPasswordRequest) {
        try {
            let existingAdmin: any = await this.repository.FindUserById(userInputs._id);
            existingAdmin = existingAdmin.profileData;

            if (existingAdmin) {
                const salt = await GenerateSalt();
                const password = await GeneratePassword(userInputs.newPassword, salt);
                //compare old password
                const validPassword = await ValidatePassword(
                    userInputs.oldPassword,
                    existingAdmin.password
                );
                if (!validPassword) {
                    return FormateError({ error: "Old password is not correct" });
                }
                //old password and new password should not be same
                if (userInputs.oldPassword === userInputs.newPassword) {
                    return FormateError({ error: "Old password and new password should not be same" });
                }
                await this.repository.UpdateUser(existingAdmin._id, {
                    password
                });
                return FormateData({ message: "Password updated successfully" });
            }

            return FormateError({ error: "Invalid Credentials" });
        } catch (err: any) {
            return FormateError({ error: "Password Reset Failed"});
        }
    }

    // sending password link
    async SocialSignUp(userInputs: socialUserSignRequest) {
        try {
            const newUser: any = await this.repository.SocialCreateUser(
                userInputs
            );

            if(newUser === true) {
                return FormateError({ error: "User already exist" })
            }

            return FormateData(newUser);
        } catch (err: any) {
            return FormateError({ error: "Social SignUp Failed" });
        }
    }

    async SocialSignIn(userInputs: socialUserLoginRequest) {
        try {
            const existingAdmin = await this.repository.FindMe(userInputs);
            const updateUser = await this.repository.UpdateUser(existingAdmin._id, { os: userInputs.os as string });

            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);
            if (checkRole === false) {
                return FormateError({ error: "Invalid Role" });
            }

            //check bussiness type
            if (userInputs.bussinessType && existingAdmin.bussinessType !== userInputs.bussinessType) {
                return FormateError({ error: "Invalid Bussiness Type" });
            }
            
            if (userInputs.loginType && existingAdmin.loginType === userInputs.loginType) {
                const token = await GenerateSignature({
                    email: existingAdmin.email,
                    _id: existingAdmin._id,
                    userName: existingAdmin.userName,
                    roleName: existingAdmin.roleId.name,
                });

                return FormateData({ id: existingAdmin._id, token, existingAdmin });
            }

            return FormateError({ error: "Invalid Credentials" });

        } catch (err: any) {
            return FormateError({ error: "Social SignIn Failed" });
        }
    }

    async expiryToken(token: string) {
        try {
            const decoded: any = jwt.verify(token, "YOKOBYTE"); // Replace 'your_secret_key_here' with your JWT secret

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
            return FormateError({ error: "Failed to check expire token" });
        }
    }

    async GetAllUsers() {
        try {
            const existingAdmin = await this.repository.FindAllUsers();
            return FormateData(existingAdmin);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //get Windows, Android, iOS, Linux, Other all counts
    async GetCount() {
        try {
            const existingUser = await this.repository.getAllOsCount();
            return (existingUser);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    async getCountOfPayment(criteria: string) {
        try {
          if (criteria === "month") {
            const UserCount: any = await this.repository.getCountOfUserPerMonth();
    
            return FormateData(UserCount);
          } else if (criteria === "week") {
            const UserCount: any = await this.repository.getCountOfUserPerWeek();
    
            return FormateData(UserCount);
          } else {
            const UserCount: any = await this.repository.getCountOfUserPerDay();
    
            return FormateData(UserCount);
          }
        } catch (err: any) {
          console.log("error", err);
          throw err;
        }
      }
}

export = AdminService;
