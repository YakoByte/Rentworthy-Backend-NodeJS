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
            const existingProfile: any = await this.repository.getAllProfile(
                profileInputs
            );

            if(!existingProfile) {
                throw Error('No data Found');
            }

            return FormateData(existingProfile);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //get profile by id
    async getProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.getProfileById(
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


    // async profileValidation(profileName: string, profileId: string) {
    //     try {
    //         const existingProfile: any = await this.repository.checkProfile(
    //             profileName,
    //             profileId
    //         );

    //         return FormateData(existingProfile);
    //     } catch (err: any) {
    //         throw new Error("Data Not found", err);
    //     }
    // }

}

export = ProfileService;
