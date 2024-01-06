import { addressModel, historyModel } from "../models";
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
import { addressRequest, getAddressRequest } from "../../interface/address";
class addressRepository {
    async CreateAddress(addressInputs: addressRequest) {
        // try {

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
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }

    async getAddressByUserId(addressInputs: getAddressRequest) {
        const findAddress = await addressModel.find({ userId: addressInputs.userId, isDeleted: false });
        console.log("findAddress", findAddress)
        if (findAddress) {
            return FormateData(findAddress);
        }
    }

    //get address by id
    async getAddressById(addressInputs: getAddressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, isDeleted: false });
        console.log("findAddress", findAddress)
        if (findAddress) {
            return FormateData(findAddress);
        }
    }

    //update address
    async updateAddressById(addressInputs: addressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, userId: addressInputs.userId, isDeleted: false });
        console.log("findAddress", findAddress)
        //if address exist
        if (findAddress) {
            const address = await addressModel
                .findOneAndUpdate(
                    {
                        _id: addressInputs._id, userId: addressInputs.userId, isDeleted: false
                    },
                    addressInputs,
                    { new: true }
                );
            return FormateData({ message: "address updated successfully" });
        }
    }

    //delete address
    async deleteAddressById(addressInputs: addressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, userId: addressInputs.userId, isDeleted: false });
        console.log("findAddress", findAddress)
        //if address exist
        if (findAddress) {
            const address = await addressModel
                .findOneAndUpdate(
                    {
                        _id: addressInputs._id,
                        userId: addressInputs.userId,
                        isDeleted: false
                    },
                    { isDeleted: true },
                    { new: true }
                );
            if (address) {

                return FormateData({ message: "address deleted successfully" });
            } else {
                return FormateData({ message: "address not found" });
            }
        } else {
            return FormateData({ message: "address not found" });
        }
    }

}

export default addressRepository;
