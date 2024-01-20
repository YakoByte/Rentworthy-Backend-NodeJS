import { locationModel, historyModel, profileModel } from "../models";
import { locationRequest } from "../../interface/location";
import { GEOLOCATION_API_KEY } from "../../config";
const { geocode } = require("opencage-api-client");

class locationRepository {
  async CreateLocation(locationInputs: locationRequest) {
    try {
      const location = new locationModel(locationInputs);
      const locationResult = await location.save();
      let findProfile = await profileModel.findOne({
        userId: locationInputs.userId,
      });
      if (findProfile) {
        await profileModel.findOneAndUpdate(
          { userId: locationInputs.userId },
          { $set: { locationId: locationResult._id } }
        );
      } else {
        const profile = new profileModel({
          userId: locationInputs.userId,
          locationId: locationResult._id,
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
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Location");
    }
  }

  async getLocationByUserId(locationInputs: locationRequest) {
    try {
      const findLocation = await locationModel.find({
        userId: locationInputs.userId,
      });
      console.log("findLocation", findLocation);
      return findLocation;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Location By userID");
    }
  }

  //get location by id
  async getLocationById(locationInputs: locationRequest) {
    try {
      const findLocation = await locationModel.findOne({
        _id: locationInputs._id,
      });
      console.log("findLocation", findLocation);
      if (findLocation) {
        return findLocation;
      }
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Location By UserID");
    }
  }

  //update location
  async updateLocationById(locationInputs: locationRequest) {
    try {
      const findLocation = await locationModel.findOne({
        _id: locationInputs._id,
        isDeleted: false,
        isBlocked: false,
      });
      console.log("findLocation", findLocation);
      //if location exist
      if (findLocation) {
        const location = await locationModel.findOneAndUpdate(
          {
            _id: locationInputs._id,
            isDeleted: false,
            isBlocked: false,
          },
          locationInputs,
          { new: true }
        );
        return location;
      }

      return false;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Update Location");
    }
  }

  //delete location
  async deleteLocationById(locationInputs: locationRequest) {
    try {
      const findLocation = await locationModel.findOne({
        _id: locationInputs._id,
        isDeleted: false,
        isBlocked: false,
      });
      console.log("findLocation", findLocation);
      //if location exist
      if (findLocation) {
        const location = await locationModel.findOneAndUpdate(
          {
            _id: locationInputs._id,
            isDeleted: false,
            isBlocked: false,
          },
          { isDeleted: true },
          { new: true }
        );
        return true;
      }

      return false;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Update Location");
    }
  }

  // count continent coordinate count
  async countCordinate() {
    try {
      const count = await locationModel.aggregate([
        {
          $group: {
            _id: {
              latitude: { $arrayElemAt: ["$location.coordinates", 0] },
              longitude: { $arrayElemAt: ["$location.coordinates", 1] },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      return count;
    } catch (error) {
      console.log("error", error);
      throw new Error("Error in counting coordinates");
    }
  }

  async countContinentCoordinate() {
    try {
      const count = await locationModel.aggregate([
        {
          $group: {
            _id: {
              latitude: { $arrayElemAt: ["$location.coordinates", 0] },
              longitude: { $arrayElemAt: ["$location.coordinates", 1] },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      const coordinates = count.map((item) => ({
        count: item.count,
        latitude: item._id.latitude,
        longitude: item._id.longitude,
      }));

      let data: any = [];

      await Promise.all(
        coordinates.map(async (coord) => {
          try {
            const response = await geocode({
              key: GEOLOCATION_API_KEY,
              q: `${coord.latitude},${coord.longitude}`,
            });
            const { components } = response.results[0];

            data.push({
              count: coord.count || 0,
              latitude: coord.latitude || null,
              longitude: coord.longitude || null,
              country: components.country || null,
              countryCode: components.country_code || null,
              continent: components.continent || null,
            });

            return response;
          } catch (error) {
            console.error("Error fetching continent name:", error);
            return null;
          }
        })
      );

      return data;
    } catch (error) {
      console.log("error", error);
      throw new Error("Error in counting Continent");
    }
  }
}

export default locationRepository;
