import AdminRepository from '../database/repository/admin';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';
import { userRequest } from '../interface/admin';

// All Business logic will be here
class AdminService {
    private repository: AdminRepository;

    constructor() {
        this.repository = new AdminRepository();
    }

    async SignIn(userInputs: { email: string, password: string }) {
        const { email, password } = userInputs;
        try {
            const existingAdmin = await this.repository.FindUser({ email });

            if (existingAdmin) {
                const validPassword = await ValidatePassword(
                    password,
                    existingAdmin.password
                );

                if (validPassword) {
                    const token = await GenerateSignature({
                        email: existingAdmin.email,
                        _id: existingAdmin._id,
                    });

                    return FormateData({ id: existingAdmin._id, token });
                }
            }

            return FormateData(null);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async SignUp(userInputs: userRequest) {
        try {
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(userInputs.password, salt);

            const existingAdmin: any = await this.repository.CreateUser(
                userInputs
            );

            const token = await GenerateSignature({
                email: userInputs.email,
                _id: existingAdmin._id,
            });

            return FormateData({ token });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async CreateUser(userInputs: userRequest) {
        // const { email, userName, password, phoneNo } = userInputs;
        try {
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(userInputs.password, salt);

            const existingAdmin: any = await this.repository.CreateUser(
                userInputs
            );

            const token = await GenerateSignature({
                email: userInputs.email,
                _id: existingAdmin._id,
            });

            return FormateData({ token });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // async AddNewAddress(userInputs: {
    //     userId: string,
    //     address1: string,
    //     address2: string,
    //     city: string,
    //     state: string,
    //     postalCode: string,
    //     country: string
    // }) {
    //     const { userId, address1, address2, city, state, postalCode, country } = userInputs;

    //     try {
    //         const addressResult = await this.repository.CreateAddress({
    //             userId,
    //             address1,
    //             address2,
    //             city,
    //             state,
    //             postalCode,
    //             country,
    //         });
    //         return FormateData(addressResult);
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }

    async GetProfile(userId: string) {
        try {
            const existingAdmin = await this.repository.FindUserById({ userId });
            return FormateData(existingAdmin);
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = AdminService;
