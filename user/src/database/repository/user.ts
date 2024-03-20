import { userModel, roleModel, historyModel, profileModel } from "../models";
import moment from "moment";
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
      let roleId = await roleModel.findOne({ name: userInputs.roleName });
      if (!roleId) {
        throw new Error(`Role with name '${userInputs.roleName}' not found.`);
      } else {
        roleId = roleId._id;
      }

      let query = {};
      if (userInputs.email) {
        query = { email: userInputs.email };
      } else if (userInputs.phoneNo) {
        query = { phoneNo: userInputs.phoneNo };
      }

      const findUser = await userModel.findOne(query);

      if (findUser) {
        return true;
      }

      // generate salt and password
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(userInputs.password, salt);

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

      const userResult: any = await userModel.findOne(query).populate("roleId");

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

  async BlockedUser(userId: string, blockedReason: string) {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        { : false },
        { neisActivew: true }
      );

      const profile = await profileModel.findOneAndUpdate(
        { userId: userId },
        { isActive: false, isBlocked: true, blockedReason: blockedReason },
        { new: true }
      );

      return {user, profile};
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Delete User");
    }
  }

  async UnBlockUser(userId: string) {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        { isActive: true },
        { new: true }
      );

      const profile = await profileModel.findOneAndUpdate(
        { userId: userId },
        { isActive: true, isBlocked: false, blockedReason: '' },
        { new: true }
      );

      return {user, profile};
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Delete User");
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
      let roleId = await roleModel.findOne({ name: userInputs.roleName });
      if (!roleId) {
        throw new Error(`Role with name '${userInputs.roleName}' not found.`);
      } else {
        roleId = roleId._id;
      }

      // check if user already exist
      let findUser;
      if (userInputs.email) {
        findUser = await userModel.findOne({
         email: userInputs.email 
        });
      } else if (userInputs.phoneNo) {
        findUser = await userModel.findOne({
         phoneNo: userInputs.phoneNo
        });
      }

      if (findUser) {
        return true;
      }

      // create user
      const user = new userModel({ ...userInputs, roleId: roleId });
      const userResult = await user.save();

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

  async getCountOfUserPerDay() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      let result = await userModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
            isDeleted: false,
          },
        },
        {
          $project: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: "$date",
            total: { $sum: 1 },
          },
        },
      ]);

      let finalData = result.map((item) => ({
        date: item._id,
        total: item.total,
      }));

      return finalData;
    } catch (error) {
      console.log("Error in getting count of day : ", error);
      return [];
    }
  }

  async getCountOfUserPerMonth() {
    try {
      // Set the startDate to the beginning of the month one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current month
      let endDate = moment().endOf("day").toISOString();

      let result = await userModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
            isDeleted: false,
          },
        },
        {
          $project: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      let finalData = result.map((item) => ({
        month: item._id,
        total: item.total,
      }));

      return finalData;
    } catch (error) {
      console.log("Error in getting count of month : ", error);
      return [];
    }
  }

  async getCountOfUserPerWeek() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      const result = await userModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
            isDeleted: false,
          },
        },
        {
          $project: {
            month: {
              $dateToString: { format: "%Y-%U", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      let finalData = result.map((item) => ({
        week: item._id,
        total: item.total,
      }));

      return finalData;
    } catch (error) {
      console.log("Error in getting count of previous years weeks : ", error);
      return [];
    }
  }
}

export default AdminRepository;
