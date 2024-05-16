import LocationRepository from '../database/repository/location';
import { FormateData, FormateError } from '../utils';
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

            if(!existingLocation){
                throw Error('Failed to create the location');
            }

            return FormateData(existingLocation);
        } catch (err: any) {
            return FormateError({ error: "Failed To Create Location" });
        }
    }

    //get location by user id
    async getLocationByUserId(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.getLocationByUserId(
                locationInputs
            );

            if(!existingLocation) {
                throw Error("No Locations Found");
            }

            return FormateData(existingLocation);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //get location by id
    async getLocationById(locationInputs: locationRequest) {
        try {
        let existingLocation: any
        if (locationInputs.userId) {
            existingLocation = await this.repository.getLocationByUserId(
                locationInputs
            );
        } else if (locationInputs._id) {
            existingLocation = await this.repository.getLocationById(
                locationInputs
            );
        }

        if(!existingLocation){
            throw new Error('Location Not Found')
        }

        return existingLocation;
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //update location
    async updateLocationById(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.updateLocationById(
                locationInputs
            );

            if(!existingLocation) {
                throw new Error("Update Failed");
            }

            return FormateData(existingLocation);
        } catch (err: any) {
            return FormateError({ error: "Failed To Update Location" });
        }
    }

    //delete location
    async deleteLocationById(locationInputs: locationRequest) {
        try {
            const existingLocation: any = await this.repository.deleteLocationById(
                locationInputs
            );

            if(!existingLocation) {
                throw new Error("Delete Failed, Location not found!");
            }

            return FormateData(existingLocation);
        } catch (err: any) {
            return FormateError({ error: "Failed To Delete Location" });
        }
    }

    async countCordinate() {
        try {
            const Location: any = await this.repository.countCordinate();

            if(!Location) {
                throw new Error('Count failed');
            }

            return FormateData(Location);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    async countContinentCoordinate() {
        try {
            const Location: any = await this.repository.countContinentCoordinate();

            if(!Location){
                throw new Error(`Not Found Continents Data`);
            }

            return FormateData(Location);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }


    // async locationValidation(locationName: string, locationId: string) {
    //     try {
    //         const existingLocation: any = await this.repository.checkLocation(
    //             locationName,
    //             locationId
    //         );

    //         return FormateData(existingLocation);
    //     } catch (err: any) {
    //         throw new Error("Data Not found", err);
    //     }
    // }

}

export = LocationService;
