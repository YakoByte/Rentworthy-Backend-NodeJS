import { userModel, roleModel, historyModel } from "../models";
import {
  GeneratePassword,
  GenerateSalt,
} from "../../utils";
import {
  userSignRequest,
  socialUserSignRequest,
  findMe,
} from "../../interface/user";
import OTPRepository from "./otp";
const OTPRep = new OTPRepository();

class AdminRepository {
  async CreateUser(userInputs: userSignRequest) {
    try {
      // check signup role
      console.log("userInputs", userInputs.roleName);
      let roleId = await roleModel.findOne({ name: userInputs.roleName });
      if (!roleId) {
        console.error(`Role with name '${userInputs.roleName}' not found.`);
      } else {
        roleId = roleId._id;
      }

      console.log("roleId", roleId);

      let query = {};
      if (userInputs.email) {
        query = { email: userInputs.email };
      } else if (userInputs.phoneNo) {
        query = { phoneNo: userInputs.phoneNo };
      }

      const findUser = await userModel.findOne(query);
      console.log(findUser, "user");

      if (findUser) {
        return true;
      }

      // generate salt and password
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(userInputs.password, salt);
      console.log("userPassword", userPassword);
      userInputs.password = userPassword;

      // create user
      const user = new userModel({ ...userInputs, roleId: roleId });
      const userResult = await user.save();

      if (user.email) {
        await OTPRep.CreateOTP({ email: user.email, phoneNo: user.phoneNo });
      }

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
      console.log("userResult", userResult);

      // return userResult;
      return userResult;
    } catch (err) {
      console.log("err", err);
      throw new Error("Unable to Create User");
    }
  }

  async FindMe(userInputs: findMe) {
    try {
      let query = {};
      if (userInputs.email) {
        query = { email: userInputs.email };
      } else if (userInputs.phoneNo) {
        query = { phoneNo: userInputs.phoneNo };
      }
      console.log("query", query);

      const userResult: any = await userModel.findOne(query).populate("roleId");
      console.log("userResult", userResult);

      return userResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Error on Find User");
    }
  }

  async FindUserById(userId: string) {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find User by ID");
    }
  }

  async checkRole(roleName: string, roleId: string) {
    try {
      const findRole = await roleModel.findOne({ _id: roleId, name: roleName });
      if (!findRole) {
        return false;
      }

      const data = {
        id: findRole._id,
        name: findRole.name,
      };

      return data;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Check Role");
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
      console.log("err", error);
      throw new Error("Error on Update User");
    }
  }

  async SocialCreateUser(userInputs: socialUserSignRequest) {
    try {
      // check signup role
      console.log("userInputs", userInputs.roleName);
      let roleId = await roleModel
        .findOne({ name: userInputs.roleName })
        .distinct("_id");
      console.log("roleId", roleId);

      // check if user already exist
      let findUser;
      if (userInputs.email) {
        findUser = await userModel.findOne({
          $or: [
            { email: userInputs.email },
            // { phoneNo: userInputs.phoneNo },
          ],
        });
      } else if (userInputs.phoneNo) {
        findUser = await userModel.findOne({
          $or: [
            // { email: userInputs.email },
            { phoneNo: userInputs.phoneNo },
          ],
        });
      }
      console.log(findUser, "user");
      if (findUser) {
        return true;
      }

      // create user
      const user = new userModel({ ...userInputs, roleId: roleId[0] });
      console.log("user", user);

      const userResult = await user.save();
      console.log("userInputs", userInputs);

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
      console.log("userResult", userResult);

      // return userResult;
      return userResult;
    } catch (err) {
      console.log("err", err);
      throw new Error(" Unable to Social Create User");
    }
  }

  async FindAllUsers() {
    try {
      const users = await userModel.find();
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async getAllOsCount() {
    try {
      const users = await userModel.aggregate([
        {
          // _id = null is not needed
          $match: { os: { $exists: true } },
        },
        {
          $group: {
            _id: "$os",
            count: { $sum: 1 },
          },
        },
      ]);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }
}

export default AdminRepository;
