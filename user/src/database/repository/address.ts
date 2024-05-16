import { addressModel, historyModel } from "../models";
import { addressRequest, getAddressRequest } from "../../interface/address";

class addressRepository {
  async CreateAddress(addressInputs: addressRequest) {
    try {
      const address = new addressModel(addressInputs);
      const addressResult = await address.save();

      const history = new historyModel({
        addressId: addressResult._id,
        log: [
          {
            objectId: addressResult._id,
            action: `address = ${addressInputs.userId} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return addressResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Address");
    }
  }

  async getAddressByUserId(addressInputs: getAddressRequest) {
    try {
      const findAddress = await addressModel.find({
        userId: addressInputs.userId,
        isDeleted: false,
      });

      console.log("findAddress", findAddress);

      return findAddress;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Address By userId");
    }
  }

  //get address by id
  async getAddressById(addressInputs: getAddressRequest) {
    try {
      const findAddress = await addressModel.findOne({
        _id: addressInputs._id,
        isDeleted: false,
      });

      if (!findAddress) {
        return false;
      }
      console.log("findAddress", findAddress);

      return findAddress;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Address By Id");
    }
  }

  //update address
  async updateAddressById(addressInputs: addressRequest) {
    try {
      const findAddress = await addressModel.findOne({
        _id: addressInputs._id,
        userId: addressInputs.userId,
        isDeleted: false,
      });

      //if address exist
      if (findAddress) {
        const address = await addressModel.findOneAndUpdate(
          {
            _id: addressInputs._id,
            userId: addressInputs.userId,
            isDeleted: false,
          },
          addressInputs,
          { new: true }
        );
        return address;
      }

      return false;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Update Address By Id");
    }
  }

  //delete address
  async deleteAddressById(addressInputs: addressRequest) {
    try {
      const findAddress = await addressModel.findOne({
        _id: addressInputs._id,
        userId: addressInputs.userId,
        isDeleted: false,
      });
      console.log("findAddress", findAddress);
      //if address exist
      if (findAddress) {
        await addressModel.findOneAndUpdate(
          {
            _id: addressInputs._id,
            userId: addressInputs.userId,
            isDeleted: false,
          },
          { isDeleted: true },
          { new: true }
        );
        return true;
      }

      return false;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Delete Address By Id");
    }
  }
}

export default addressRepository;
