import LocationRepository from '../database/repository/location';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { locationRequest } from '../interface/location';

// All Business logic will be here
class LocationService {
    private repository: LocationRepository;

    constructor() {
        this.repository = new LocationRepository();
    }

    async CreateLocation(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.CreateLocation(
                locationInputs
            );

            return FormateData({ existingLocation });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get location by user id
    async getLocationByUserId(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.getLocationByUserId(
                locationInputs
            );

            return FormateData({ existingLocation });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get location by id
    async getLocationById(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.getLocationById(
                locationInputs
            );

            return FormateData({ existingLocation });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //update location
    async updateLocationById(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.updateLocationById(
                locationInputs
            );

            return FormateData({ existingLocation });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //delete location
    async deleteLocationById(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.deleteLocationById(
                locationInputs
            );

            return FormateData({ existingLocation });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }


    // async locationValidation(locationName: string, locationId: string) {
    //     try {
    //         const existingLocation: any = await this.repository.checkLocation(
    //             locationName,
    //             locationId
    //         );

    //         return FormateData({ existingLocation });
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }

}

export = LocationService;
