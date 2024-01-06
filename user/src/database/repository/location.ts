import { locationModel, historyModel, profileModel } from "../models";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { locationRequest } from "../../interface/location";
class locationRepository {
    async CreateLocation(locationInputs: locationRequest) {
        // try {

        const location = new locationModel(locationInputs);
        const locationResult = await location.save();
        let findProfile = await profileModel.findOne({ userId: locationInputs.userId });
        if (findProfile) {
            await profileModel.findOneAndUpdate({ userId: locationInputs.userId }, { $set: { locationId: locationResult._id } })
        }
        else {
            const profile = new profileModel({
                userId: locationInputs.userId,
                locationId: locationResult._id
            });
            await profile.save();
        }
        const history = new historyModel({
            locationId: locationResult._id,
            log: [
                {
                    objectId: locationResult._id,
                    action: `location = ${locationInputs.userId} created`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();

        return locationResult;
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }

    async getLocationByUserId(locationInputs: locationRequest) {
        const findLocation = await locationModel.find({ userId: locationInputs.userId, });
        console.log("findLocation", findLocation)
        if (findLocation) {
            return FormateData(findLocation);
        }
    }

    //get location by id
    async getLocationById(locationInputs: locationRequest) {
        const findLocation = await locationModel.findOne({ _id: locationInputs._id, });
        console.log("findLocation", findLocation)
        if (findLocation) {
            return FormateData(findLocation);
        }
    }

    //update location
    async updateLocationById(locationInputs: locationRequest) {
        const findLocation = await locationModel.findOne({ _id: locationInputs._id, isDeleted: false, isBlocked: false });
        console.log("findLocation", findLocation)
        //if location exist
        if (findLocation) {
            const location = await locationModel
                .findOneAndUpdate(
                    {
                        _id: locationInputs._id,
                        isDeleted: false,
                        isBlocked: false
                    },
                    locationInputs,
                    { new: true }
                );
            return FormateData({ message: "location updated successfully" });
        }
    }

    //delete location
    async deleteLocationById(locationInputs: locationRequest) {
        const findLocation = await locationModel.findOne({ _id: locationInputs._id, isDeleted: false, isBlocked: false });
        console.log("findLocation", findLocation)
        //if location exist
        if (findLocation) {
            const location = await locationModel
                .findOneAndUpdate(
                    {
                        _id: locationInputs._id,
                        isDeleted: false,
                        isBlocked: false
                    },
                    { isDeleted: true },
                    { new: true }
                );
            return FormateData({ message: "location deleted successfully" });
        }
    }

}

export default locationRepository;
