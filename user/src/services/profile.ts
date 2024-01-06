import ProfileRepository from '../database/repository/profile';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

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

            return FormateData({ existingProfile });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // get all profile
    async getAllProfile(profileInputs: getProfileRequest) {
        try {
            const existingProfile: any = await this.repository.getAllProfile(
                profileInputs
            );

            return FormateData(existingProfile);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get profile by id
    async getProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.getProfileById(
                profileInputs
            );

            return FormateData(existingProfile);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //update profile
    async updateProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.updateProfileById(
                profileInputs
            );

            return FormateData({ existingProfile });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //delete profile
    async deleteProfileById(profileInputs: profileRequest) {
        try {
            const existingProfile: any = await this.repository.deleteProfileById(
                profileInputs
            );

            return FormateData({ existingProfile });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }


    // async profileValidation(profileName: string, profileId: string) {
    //     try {
    //         const existingProfile: any = await this.repository.checkProfile(
    //             profileName,
    //             profileId
    //         );

    //         return FormateData({ existingProfile });
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }

}

export = ProfileService;
