import { addressModel, historyModel } from "../models";
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
import { addressRequest } from "../../interface/address";
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

    async getAddressByUserId(addressInputs: addressRequest) {
        const findAddress = await addressModel.find({ userId: addressInputs.userId, isDeleted: false, isBlocked: false, });
        console.log("findAddress", findAddress)
        if (findAddress) {
            return FormateData(findAddress);
        }
    }

    //get address by id
    async getAddressById(addressInputs: addressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, isDeleted: false, isBlocked: false, });
        console.log("findAddress", findAddress)
        if (findAddress) {
            return FormateData(findAddress);
        }
    }

    //update address
    async updateAddressById(addressInputs: addressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, isDeleted: false, isBlocked: false });
        console.log("findAddress", findAddress)
        //if address exist
        if (findAddress) {
            const address = await addressModel
                .findOneAndUpdate(
                    {
                        _id: addressInputs._id,
                        isDeleted: false,
                        isBlocked: false
                    },
                    addressInputs,
                    { new: true }
                );
            return FormateData({ message: "address updated successfully" });
        }
    }

    //delete address
    async deleteAddressById(addressInputs: addressRequest) {
        const findAddress = await addressModel.findOne({ _id: addressInputs._id, isDeleted: false, isBlocked: false });
        console.log("findAddress", findAddress)
        //if address exist
        if (findAddress) {
            const address = await addressModel
                .findOneAndUpdate(
                    {
                        _id: addressInputs._id,
                        isDeleted: false,
                        isBlocked: false
                    },
                    { isDeleted: true },
                    { new: true }
                );
            return FormateData({ message: "address deleted successfully" });
        }
    }

}

export default addressRepository;
