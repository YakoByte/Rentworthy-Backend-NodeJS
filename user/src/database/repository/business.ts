import { businessModel, userModel } from "../models";
import {
  FormateData,
  // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from "../../utils";
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
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
      return FormateData(returnVal);
    } catch (err) {
      console.log("err", err);
      return err;
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
        FormateData({ message: "business info does not exists." });
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
      return FormateData(returnVal);
    } catch (err) {
      console.log("err", err);
      return err;
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
      return FormateData(returnVal);
    } catch (err) {
      console.log("err", err);
      return err;
    }
  }
}

export default AdminRepository;
