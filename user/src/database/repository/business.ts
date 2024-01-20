import { businessModel, userModel } from "../models";
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
        .findOne({
          _id: businessInputs.id,
        })
        .lean();
      if (!findRec) {
        return false
      }

      let returnVal = await businessModel.findOneAndUpdate(
        {
          _id: businessInputs.id,
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
      let query: any = {};
      if (businessInputs.id) {
        query["_id"] = businessInputs.id;
      }
      if (businessInputs.name) {
        query["businessName"] = new RegExp(businessInputs.name, "i");
      }
      if (businessInputs.userId) {
        query["userId"] = businessInputs.userId;
      }
      if (businessInputs.status) {
        query["isApproved"] = businessInputs.status;
      }
      returnVal = await businessModel.find(query).lean();
      return returnVal;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Business");
    }
  }
}

export default AdminRepository;
