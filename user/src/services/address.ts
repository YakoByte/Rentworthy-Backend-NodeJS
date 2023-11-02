import AddressRepository from '../database/repository/address';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { addressRequest } from '../interface/address';

// All Business logic will be here
class AddressService {
    private repository: AddressRepository;

    constructor() {
        this.repository = new AddressRepository();
    }

    async CreateAddress(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.CreateAddress(
                addressInputs
            );

            return FormateData({ existingAddress });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get address by user id
    async getAddressByUserId(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.getAddressByUserId(
                addressInputs
            );

            return FormateData({ existingAddress });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //get address by id
    async getAddressById(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.getAddressById(
                addressInputs
            );

            return FormateData({ existingAddress });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //update address
    async updateAddressById(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.updateAddressById(
                addressInputs
            );

            return FormateData({ existingAddress });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    //delete address
    async deleteAddressById(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.deleteAddressById(
                addressInputs
            );

            return FormateData({ existingAddress });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }


    // async addressValidation(addressName: string, addressId: string) {
    //     try {
    //         const existingAddress: any = await this.repository.checkAddress(
    //             addressName,
    //             addressId
    //         );

    //         return FormateData({ existingAddress });
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }

}

export = AddressService;
