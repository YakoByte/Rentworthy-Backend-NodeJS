import { userModel, roleModel, historyModel, profileModel, ProductModel } from "../models";
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
        return false;
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

      await userModel.updateOne(
        { _id: userResult?._id },
        { $inc: { interection: 1 } }
      );

      // return userResult;
      return userResult;
    } catch (err) {
      console.log("err", err);
      throw new Error("Unable to Create User");
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
      if(userInputs.email) {
        user.isEmailVerified = true;
      } else if(userInputs.phoneNo) {
        user.isPhoneNoVerified = true;
      }
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

      await userModel.updateOne(
        { _id: userResult?._id },
        { $inc: { interection: 1 } }
      );

      // return userResult;
      return userResult;
    } catch (err) {
      console.log("err", err);
      throw new Error(" Unable to Social Create User");
    }
  }

  async UpdateUserCredentials(userInputs: findMe) {
    try {      
      let userResult = await userModel.findById(userInputs._id);

      if(!userResult) {
        return {message: "No user Found"};
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
        return {message: "User already exist with these credential...."};
      }

      if (userInputs.email) {
        userResult = await userModel.findOneAndUpdate({_id: userInputs._id}, {email: userInputs.email}, {new: true});
      } else if (userInputs.phoneNo) {
        userResult = await userModel.findOneAndUpdate({_id: userInputs._id}, {phoneNo: userInputs.phoneNo, isPhoneNoVerified: true}, {new: true});
      }

      // create history
      const history = new historyModel({
        userId: userResult?._id,
        log: [
          {
            objectId: userResult?._id,
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

  async FindMe(userInputs: findMe) {
    try {
      let query = {};
      if (userInputs.email) {
        query = { email: userInputs.email };
      } else if (userInputs.phoneNo) {
        query = { phoneNo: userInputs.phoneNo };
      }

      const userResult: any = await userModel.findOne(query).populate("roleId");

      await userModel.updateOne(
        { _id: userResult?._id },
        { $inc: { interection: 1 } }
      );

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
        { isActive: false, isBlocked: true },
        { new: true }
      );

      const profile = await profileModel.findOneAndUpdate(
        { userId: userId },
        { isActive: false, isBlocked: true, blockedReason: blockedReason },
        { new: true }
      );

      await ProductModel.updateMany({ userId: userId }, { $set: { isActive: false } }, { new: true });

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
        { isActive: true, isBlocked: false },
        { new: true }
      );

      const profile = await profileModel.findOneAndUpdate(
        { userId: userId },
        { isActive: true, isBlocked: false, blockedReason: '' },
        { new: true }
      );

      await ProductModel.updateMany({ userId: userId }, { $set: { isActive: true } }, { new: true });

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

  //get user data
  async FindUserDataById(_id: string) {
    try {
      const users = await userModel.findById(_id).populate('roleId');
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByEmail(email: string) {
    try {
      const users = await userModel.findOne({ email }).populate('roleId');
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByPhoneNo(userInput: {phoneNo: string, skip: number, limit: number}) {
    try {
      const users = await userModel.find({ phoneNo: userInput.phoneNo }).populate('roleId');
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find().populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByRole(userInput: {roleName: string, skip: number, limit: number}) {
    try {
      const role = await roleModel.findOne({ name: userInput.roleName });

      if(!role) {
        throw new Error(`Role with name '${userInput.roleName}' not found.`);
      }

      const users = await userModel.find({ roleId: role._id }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByLoginType(userInput: {loginType: string, skip: number, limit: number}) {
    try {
      const users = await userModel.find({ loginType: userInput.loginType }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByOS(userInput: {os: string, skip: number, limit: number}) {
    try {
      const users = await userModel.find({ os: userInput.os }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindUserByBussinessType(userInput: {bussinessType: string, skip: number, limit: number}) {
    try {
      const users = await userModel.find({ bussinessType: userInput.bussinessType }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllActiveUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find({ isActive: true }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllDeletedUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find({ isDeleted: true }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllBlockedUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find({ isBlocked: true }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllUnVerifiedUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find({ $or: [{ isEmailVerified: false, isPhoneNoVerified: false }] }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  async FindAllVerifiedUsers(userInput: {skip: number, limit: number}) {
    try {
      const users = await userModel.find({ $or: [{ isEmailVerified: true, isPhoneNoVerified: true }] }).populate('roleId').skip(userInput.skip).limit(userInput.limit);
      return users;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Find All Users");
    }
  }

  //get count
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

  async getUserVIN(userInput: {_id: string}) {
    try {
        const user = await userModel.findOne({ _id: userInput._id });

        return {view: user?.views || 0, interection: user?.interection || 0};
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

export default AdminRepository;
