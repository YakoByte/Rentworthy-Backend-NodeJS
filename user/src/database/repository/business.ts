import { businessModel, userModel } from "../models";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import {
  BusinessRequest,
  BusinessAppRequest,
  BusinessGetRequest,
} from "../../interface/business";

class AdminRepository {
  async CreateBusiness(businessInputs: BusinessRequest) {
    try {
      let findRec = await businessModel
        .findOne({
          userId: businessInputs.userId,
        })
        .lean();
      let returnVal;
      if (findRec) {
        await businessModel.findOneAndUpdate(
          {
            userId: businessInputs.userId,
          },
          {
            $set: {
              isDeleted: true,
            },
          }
        );
        returnVal = await businessModel.create(businessInputs);
      } else {
        returnVal = await businessModel.create(businessInputs);
      }
      return returnVal;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Business");
    }
  }

  async ApproveRejectBusiness(businessInputs: BusinessAppRequest) {
    try {
      let findRec: any = await businessModel
        .findOne({_id: businessInputs._id}).lean();
      if (!findRec) {
        return false
      }

      let returnVal = await businessModel.findOneAndUpdate(
        {
          _id: businessInputs._id,
        },
        {
          $set: {
            isApproved: businessInputs.status,
          },
        },
        {
          new: true,
        }
      );
      if (businessInputs.status === "approved") {
        await userModel.findOneAndUpdate(
          {
            _id: findRec.userId,
          },
          {
            $set: {
              bussinessType: "company",
            },
          }
        );
      }
      return returnVal;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Approved/Reject Business");
    }
  }

  async GetBusiness(businessInputs: BusinessGetRequest) {
    try {
      let returnVal;
      let criteria: any = { isDeleted: false };

      if (businessInputs._id) {
        criteria._id = new Types.ObjectId(businessInputs._id);
      }
      if (businessInputs.name) {
        criteria.businessName = new RegExp(businessInputs.name, "i");
      }
      if (businessInputs.userId) {
        criteria.userId = new Types.ObjectId(businessInputs.userId);
      }
      if (businessInputs.status) {
        criteria.isApproved = businessInputs.status;
      }
      returnVal = await businessModel.find(criteria).lean();
      return returnVal;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Business");
    }
  }
}

export default AdminRepository;
