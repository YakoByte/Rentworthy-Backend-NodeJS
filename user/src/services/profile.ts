import ProfileRepository from '../database/repository/profile';
import { FormateData, FormateError } from '../utils';

import { profileRequest, getProfileRequest } from '../interface/profile';

// All Business logic will be here
class ProfileService {
    private repository: ProfileRepository;

    constructor() {
        this.repository = new ProfileRepository();
    }

    async CreateProfile(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.CreateProfile(
                profileInputs
            );

            if(!existingProfile) {
                throw Error('Failed to create user profile');
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Failed To Create Profile" });
        }
    }

    // get all profile
    async getAllProfile(profileInputs: getProfileRequest) {
        try {                        
            let existingProfile: any;

            if(profileInputs._id) {
                existingProfile = await this.repository.getProfileById(profileInputs);
            }
            else if(profileInputs.userId) {
                existingProfile = await this.repository.getProfileByUserId(profileInputs);
            }
            else if(profileInputs.isActive) {
                existingProfile = await this.repository.getAllActiveProfile({
                    skip: Number(profileInputs.page) * Number(profileInputs.limit) - Number(profileInputs.limit) || 0,
                    limit: Number(profileInputs.limit) || 10 
                });
            }
            else if(profileInputs.isBlocked) {
                existingProfile = await this.repository.getAllBlockedProfile({
                    skip: Number(profileInputs.page) * Number(profileInputs.limit) - Number(profileInputs.limit) || 0,
                    limit: Number(profileInputs.limit) || 10 
                });
            }
            else if(profileInputs.isDeleted) {
                existingProfile = await this.repository.getAllDeletedProfile({
                    skip: Number(profileInputs.page) * Number(profileInputs.limit) - Number(profileInputs.limit) || 0,
                    limit: Number(profileInputs.limit) || 10 
                });
            }
            else {
                existingProfile = await this.repository.getAllProfile({
                    skip: Number(profileInputs.page) * Number(profileInputs.limit) - Number(profileInputs.limit) || 0,
                    limit: Number(profileInputs.limit) || 10
                });
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //get profile by id
    async getProfileByUserId(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.getProfileByUserId(
                profileInputs
            );

            if(!existingProfile) {
                throw Error("User not Found");
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //update profile
    async updateProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.updateProfileById(
                profileInputs
            );

            if(!existingProfile){
                throw new Error("User not Found");
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Failed To Update Profile" });
        }
    }

    async updateLevel(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.updateLevel(
                profileInputs
            );

            if(!existingProfile){
                throw new Error(`Level Updation Failed`)
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Failed To Update Level" });
        }
    }

    //delete profile
    async deleteProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.deleteProfileById(
                profileInputs
            );

            if(!existingProfile) {
                throw new Error('No User Profile Found');
            }

                return FormateData({ message: "Profile Successfully Deleted" });
        } catch (err: any) {
            return FormateError({ error: "Failed To Delete Profile" });
        }
    }

    async updateUserView(userId: string) {
        try {
            return await this.repository.updateUserView({_id: userId});
        } catch (error) {
          console.log("Error: ", error);
        }
    }

}

export = ProfileService;
