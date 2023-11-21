import { userModel, roleModel, historyModel } from "../models";
import { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES, } from "../../utils/app-error";
import { userSignRequest, userLoginRequest } from "../../interface/user";
import { roleRequest } from "../../interface/role";





class AdminRepository {

  async CreateUser(userInputs: userSignRequest) {
    try {
      // check signup role
      console.log("userInputs", userInputs.roleName)
      let roleId = await roleModel.findOne({ name: userInputs.roleName }).distinct('_id');
      console.log("roleId", roleId)
      // console.log("role", role)
      // if (!role || role?.name !== userInputs.roleName) {
      //   return FormateData({ message: "Invalid Role" });
      // }
      // check if user already exist
      const findUser = await userModel.findOne(
        {
          $or: [
            { email: userInputs.email },
            { phoneNo: userInputs.phoneNo },
          ]
        });
      if (findUser) {
        return FormateData({ message: "User already exist" });
      }
      // generate salt and password
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(userInputs.password, salt);
      console.log("userPassword", userPassword)
      userInputs.password = userPassword;

      // create user
      const user = new userModel(
        { ...userInputs, roleId: roleId[0] }
      );
      console.log("user", user)
      const userResult = await user.save();
      console.log("userInputs", userInputs)

      // create history
      const history = new historyModel({
        userId: userResult._id,
        log: [
          {
            objectId: userResult._id,
            action: `email = ${userInputs.email} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();
      console.log("userResult", userResult)

      // return userResult;
      return userResult;
    } catch (err) {
      console.log("err", err)
    }
  }

  // async CreateAdmin({ username, email, phoneNo, password }: { username: string; email: string; phoneNo: string; password: string }) {
  //   try {
  //     const admin = new userModel({
  //       username,
  //       contact: [{ phoneNo, email }],
  //       isVerified: false, // Assuming this field's type
  //     });
  //     const adminResult = await admin.save();

  //     const history = new historyModel({
  //       userId: adminResult._id,
  //       log: [
  //         {
  //           objectId: adminResult._id,
  //           action: "admin created",
  //           date: new Date().toISOString(),
  //           time: Date.now(),
  //         },
  //       ],
  //     });
  //     await history.save();

  //     return adminResult;
  //   } catch (error) {
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Error on Create Admin"
  //     );
  //   }
  // }

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

  async FindMe(userInputs: userLoginRequest) {
    try {

      const userResult: any = await userModel.findOne({ $or: [{ email: userInputs.email }, { phoneNo: userInputs?.phoneNo }] }).populate("roleId");
      // check role 
      // let role: any = await roleModel.findOne({ _id: userResult?.roleId });
      // if (role || role?.name === userInputs.roleName) {
      console.log("userResult", userResult)
      return userResult;
      // }
      // return FormateData({ message: "Invalid Role" });
    } catch (error) {
      console.log("error", error)
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Find User"
      );
    }
  }
  async FindUserById(userId: string) {
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

  async checkRole(roleName: string, roleId: string) {
    const findRole = await roleModel.findOne({ _id: roleId, name: roleName });
    console.log("findRole", findRole)
    if (findRole) {
      return FormateData({ id: findRole._id, name: findRole.name });
    } else {
      return FormateData({ message: "Invalid Role" });
    }
  }


  async UpdateUser(userId: string, data: object) {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: data },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Update User"
      );
    }
  }
}

export default AdminRepository;
