import { userModel, historyModel } from "../models";
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
import { userRequest } from "../../interface/admin";
class AdminRepository {
  async CreateUser(userInputs: userRequest) {
    try {
      const findUser = await userModel.findOne({ $or: [{ email: userInputs.email }, { phoneNo: userInputs.phoneNo }] });
      if (findUser) {
        const validPassword = await ValidatePassword(
          userInputs.password,
          findUser.password
        );
        if (validPassword) {
          const token = await GenerateSignature({
            email: findUser.email,
            _id: findUser._id,
          });

          return FormateData({ id: findUser._id, token });
        }
        return FormateData(null);
      }


      const user = new userModel({
        userInputs
      });
      const userResult = await user.save();

      const history = new historyModel({
        userId: userResult._id,
        log: [
          {
            objectId: userResult._id,
            action: `Username = ${userInputs.userName} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return userResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create User"
      );
    }
  }

  async CreateAdmin({ username, email, phoneNo, password }: { username: string; email: string; phoneNo: string; password: string }) {
    try {
      const admin = new userModel({
        username,
        contact: [{ phoneNo, email }],
        isVerified: false, // Assuming this field's type
      });
      const adminResult = await admin.save();

      const history = new historyModel({
        userId: adminResult._id,
        log: [
          {
            objectId: adminResult._id,
            action: "admin created",
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return adminResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Admin"
      );
    }
  }

  // async CreateAddress({
  //   userId,
  //   address1,
  //   address2,
  //   city,
  //   state,
  //   postalCode,
  //   country,
  // }: { userId: string; address1: string; address2: string; city: string; state: string; postalCode: string; country: string }) {
  //   try {
  //     const user = await userModel.findById(userId);

  //     if (user) {
  //       const Address = new addressModel({
  //         address1,
  //         address2,
  //         city,
  //         state,
  //         postalCode,
  //         country,
  //       });
  //       const addressResult = await Address.save();

  //       const history = await historyModel.findOne({ userId });
  //       if (history) {
  //         history.log.push({
  //           objectId: addressResult._id,
  //           action: "address created",
  //           date: new Date().toISOString(),
  //           time: Date.now(),
  //         });
  //         await history.save();
  //       }

  //       return addressResult;
  //     }
  //   } catch (err) {
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Error on Create Address"
  //     );
  //   }
  // }

  async FindUser({ email }: { email: string }) {
    try {
      const userResult = await userModel.findOne({ email });
      return userResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Find User"
      );
    }
  }

  async FindUserById({ userId }: { userId: string }) {
    try {
      const user = await userModel.findById(userId);
      // const address = await addressModel.findOne({ userId });
      const profile = await userModel.findOne({ _id: userId });
      // const password = await passwordModel.findOne({ userId });

      const userResult = {
        profileData: profile,
        // passwordSecurityData: password,
        // addressData: address,
      };
      return userResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Find User by ID"
      );
    }
  }
}

export default AdminRepository;
