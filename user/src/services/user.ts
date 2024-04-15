import AdminRepository from '../database/repository/user';
import OTPRepository from '../database/repository/otp';
import jwt from 'jsonwebtoken';
import {
    FormateData,
    FormateError,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { userSignRequest, userLoginRequest, userSetPasswordRequest, socialUserSignRequest, socialUserLoginRequest, forgotPassword, GetUserRequest } from '../interface/user';

// All Business logic will be here
class AdminService {
    // private admin repository: AdminRepository;
    private repository: AdminRepository;
    private otprepository: OTPRepository;


    constructor() {
        this.repository = new AdminRepository();
        this.otprepository = new OTPRepository();
    }

    async SignIn(userInputs: userLoginRequest) {
        try {
            const existingAdmin = await this.repository.FindMe(userInputs);
            await this.repository.UpdateUser(existingAdmin._id, { os: userInputs.os as string });
            
            // check role
            const checkRole: any = await this.repository.checkRole(userInputs.roleName, existingAdmin.roleId);

            if (checkRole === false) {
                return FormateError({ error: "Invalid Role" });
            }

            //check bussiness type
            if (userInputs.bussinessType && existingAdmin.bussinessType !== userInputs.bussinessType) {
                return FormateError({ error: "Invalid Bussiness Type" });
            }

            if (existingAdmin && existingAdmin.password) {
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
                        isActive: existingAdmin.isActive
                    });

                    return FormateData({ id: existingAdmin._id, token, existingAdmin });
                }
            }

            return FormateError({ error: "Invalid Credentials" });

        } catch (err: any) {
            return FormateError({ error: "Login Failed" });
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
                throw FormateError({error: "Role Not Found"});
            }

            return FormateData(newUser);
        } catch (err: any) {
            return FormateError({ error: "Creation Failed" });
        }
    }

    async UpdateUserCredentials(userInputs: userLoginRequest) {
        try {
            const existingUser = await this.repository.UpdateUserCredentials(userInputs);
            return (existingUser);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    async BlockedUser(userId: string, reason: string) {
        try {
            const existingAdmin = await this.repository.BlockedUser(userId, reason);
            return FormateData(existingAdmin);
        } catch (err: any) {
            return FormateError({ error: "Profile Not found" });
        }
    }

    async UnBlockUser(userId: string) {
        try {
            const existingAdmin = await this.repository.UnBlockUser(userId);
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

            if (existingAdmin) {
                const salt = await GenerateSalt();
                const password = await GeneratePassword(userInputs.newPassword, salt);
                
                //compare old password
                if(existingAdmin.password) {
                    const validPassword = await ValidatePassword(
                        userInputs.oldPassword,
                        existingAdmin.password
                    );
                    if (validPassword) {
                        return FormateError({ error: "Old password is not correct" });
                    }
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

    async forgotPasswordSendOtp(userInputs: forgotPassword) {
        try {            
            let existingAdmin = await this.repository.FindMe(userInputs);

            if (existingAdmin) {
                const existingOTP: any = await this.otprepository.CreateOTP(
                    userInputs
                );
    
                if(!existingOTP){
                    throw Error('Something went wrong while creating OTP');
                }

                return FormateData({ message: "Email Send successfully" });
            }

            return FormateError({ error: "Invalid Credentials" });
        } catch (err: any) {
            console.log(err);
            
            return FormateError({ error: "Password Reset Failed"});
        }
    }

    async forgotPassword(userInputs: forgotPassword) {
        try {            
            let existingAdmin = await this.repository.FindMe(userInputs);

            if (existingAdmin) {
                // Generate password hash for the new password
                const salt = await GenerateSalt();
                const password = await GeneratePassword(userInputs.password, salt);

                if(existingAdmin.password) {
                    const validPassword = await ValidatePassword(
                        userInputs.password,
                        existingAdmin?.password
                    );
                    if (validPassword) {
                        return FormateError({ error: "Old password is same as new password" });
                    }
                }

                // Check if otp is valid
                const isOtpValid = await this.otprepository.VerifyOTP(userInputs);
                if (!isOtpValid) {
                    throw Error("Invalid otp");
                }

                await this.repository.UpdateUser(existingAdmin._id, {
                    password,
                    isEmailVerified: true,
                });

                return FormateData({ message: "Password updated successfully" });
            }

            return FormateError({ error: "Invalid Credentials" });
        } catch (err: any) {
            console.log(err);
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
                    isActive: existingAdmin.isActive
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

    async GetAllUsers(userInputs: GetUserRequest) {
        try {
            let existingUser: any;
            if(userInputs._id) {
                existingUser = await this.repository.FindUserDataById(userInputs._id);
            }
            else if(userInputs.email) {
                existingUser = await this.repository.FindUserByEmail(userInputs.email);
            }
            else if(userInputs.phoneNo) {
                existingUser = await this.repository.FindUserByPhoneNo({
                    phoneNo: userInputs.phoneNo,
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.roleName) {
                existingUser = await this.repository.FindUserByRole({
                    roleName: userInputs.roleName,
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.loginType) {
                existingUser = await this.repository.FindUserByLoginType({
                    loginType: userInputs.loginType,
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.os) {
                existingUser = await this.repository.FindUserByOS({
                    os: userInputs.os,
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.bussinessType) {
                existingUser = await this.repository.FindUserByBussinessType({
                    bussinessType: userInputs.bussinessType,
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.isActive) {
                existingUser = await this.repository.FindAllActiveUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.isBlocked) {
                existingUser = await this.repository.FindAllBlockedUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.isDeleted) {
                existingUser = await this.repository.FindAllDeletedUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.isVerified) {
                existingUser = await this.repository.FindAllVerifiedUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else if(userInputs.isUnverified) {
                existingUser = await this.repository.FindAllUnVerifiedUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10 
                });
            }
            else {
                existingUser = await this.repository.FindAllUsers({
                    skip: Number(userInputs.page) * Number(userInputs.limit) - Number(userInputs.limit) || 0,
                    limit: Number(userInputs.limit) || 10
                });
            }

            return FormateData(existingUser);
        } catch (error: any) {
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
