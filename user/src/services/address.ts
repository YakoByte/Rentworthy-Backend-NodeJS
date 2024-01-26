import AddressRepository from '../database/repository/address';
import { FormateData, FormateError } from '../utils';
import { addressRequest, getAddressRequest } from '../interface/address';

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

            if(!existingAddress){
                throw Error('Failed to create the address');
            }

            return FormateData(existingAddress);
        } catch (err: any) {
            return FormateError({ error: "Failed to create the address" });
        }
    }

    //get address by user id
    async getAddressByUserId(addressInputs: getAddressRequest) {
        try {
            const existingAddress: any = await this.repository.getAddressByUserId(
                addressInputs
            );

            if(!existingAddress){
                throw Error("No addresses found");
            }

            return FormateData(existingAddress);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //get address by id
    async getAddressById(addressInputs: getAddressRequest) {
        try {
            let existingAddress: any
            if (addressInputs.userId) {
                existingAddress = await this.repository.getAddressByUserId(
                    addressInputs
                );

            } else if (addressInputs._id) {
                existingAddress = await this.repository.getAddressById(
                    addressInputs
                );
            }

            if(!existingAddress){
                throw new Error("Address not Found");
            }

            return FormateData(existingAddress);
        } catch (err: any) {
            return FormateError({ error: "Data Not found" });
        }
    }

    //update address
    async updateAddressById(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.updateAddressById(
                addressInputs
            );

            if(existingAddress==false){
                throw new Error('Failed to Update Address');
            }

            return FormateData(existingAddress);
        } catch (err: any) {
            return FormateError({ error: "Failed to Update Address" });
        }
    }

    //delete address
    async deleteAddressById(addressInputs: addressRequest) {
        try {
            const existingAddress: any = await this.repository.deleteAddressById(
                addressInputs
            );

            if(!existingAddress){
                throw new Error("Address not Deleted");
            }

            return FormateData(existingAddress);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Address" });
        }
    }


    // async addressValidation(addressName: string, addressId: string) {
    //     try {
    //         const existingAddress: any = await this.repository.checkAddress(
    //             addressName,
    //             addressId
    //         );

    //         return FormateData(existingAddress);
    //     } catch (err: any) {
    //         throw new Error("Data Not found", err);
    //     }
    // }

}

export = AddressService;
