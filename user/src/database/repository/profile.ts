import { profileModel, historyModel } from "../models";
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
import { profileRequest, getProfileRequest } from "../../interface/profile";
class profileRepository {
    async CreateProfile(profileInputs: profileRequest) {
        // try {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId });
        console.log("findProfile", findProfile)
        if (findProfile) {
            return FormateData(findProfile);
        }

        const profile = new profileModel(profileInputs);
        const profileResult = await profile.save();

        const history = new historyModel({
            profileId: profileResult._id,
            log: [
                {
                    objectId: profileResult._id,
                    action: `profile = ${profileInputs.userId} created`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();

        return profileResult;
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }

    //get all profile active or inactive blocked or unblocked
    async getAllProfile(profileInputs: getProfileRequest) {
        const findProfile = await profileModel.find(profileInputs)
            .populate([{ path: "userId", select: "userName email phoneNo bussinessType" }, { path: "locationId", select: "location" }]);
        console.log("findProfile", findProfile)
        if (findProfile) {
            return findProfile;
        }
    }

    async getProfileById(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false, })
            .populate([{ path: "userId", select: "userName email phoneNo bussinessType" }, { path: "locationId", select: "location" }]);
        console.log("findProfile", findProfile)
        if (findProfile) {
            return findProfile;
        }
    }

    //update profile
    async updateProfileById(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false });
        console.log("findProfile", findProfile)
        //if profile exist
        if (findProfile) {
            const profile = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    profileInputs,
                    { new: true }
                );
            return FormateData({ message: "profile updated successfully" });
        }
    }

    //delete profile
    async deleteProfileById(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false });
        console.log("findProfile", findProfile)
        //if profile exist
        if (findProfile) {
            const profile = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    { isDeleted: true },
                    { new: true }
                );
            return FormateData({ message: "profile deleted successfully" });
        }
    }

}

export default profileRepository;
