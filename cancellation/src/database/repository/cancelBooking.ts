import { cancelBookingModel, productModel, historyModel } from "../models";
import { ObjectId } from "mongodb";
import moment from "moment";
import { FormateData } from "../../utils/index";
import { APIError } from "../../utils/app-error";
import {
  cancelBookingRequest,
  cancelBookingGetRequest,
  cancelBookingUpdateRequest,
  cancelBookingApproveRequest,
  cancelBookingDeleteRequest,
} from "../../interface/cancelBooking";
import { sendEmail } from "../../template/emailTemplate";

class CancelBookingRepository {
  //create cancelBooking
  async CreateCancelBooking(cancelBookingInputs: cancelBookingRequest) {
    try {
      const cancelBooking = await cancelBookingModel.create(
        cancelBookingInputs
      );

      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new ObjectId(cancelBooking._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: "Cancellation Initiated",
          templateVariables: { action: "Cancellation Initiated" },
        };

        sendEmail(emailOptions);
      }

      return FormateData(cancelBooking);
    } catch (err: any) {
      return FormateData(err);
    }
  }

  //get cancelBooking by id , all cancelBooking
  async getAllCancelBooking(cancelBookingInputs: cancelBookingGetRequest) {
    try {
      let cancelBooking: any;
      if (cancelBookingInputs._id) {
        cancelBooking = await cancelBookingModel.findOne({
          _id: cancelBookingInputs._id,
          // isDeleted: false
        });
      } else {
        cancelBooking = await cancelBookingModel.find({
          ...cancelBookingInputs,
          // isDeleted: false
        });
      }
      return FormateData(cancelBooking);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  //update cancelBooking by id
  async updateCancelBookingById(
    cancelBookingInputs: cancelBookingUpdateRequest
  ) {
    const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
      { _id: cancelBookingInputs._id },
      { ...cancelBookingInputs },
      { new: true }
    );
    if (cancelBookingResult) {
      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new ObjectId(cancelBookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: `Cancellation ${cancelBookingInputs.status}`,
          templateVariables: { action: `Cancellation ${cancelBookingInputs.status}` },
        };

        sendEmail(emailOptions);
      }
      
      return FormateData(cancelBookingResult);
    }
  }

  async approveRejectCancelBookingById(
    cancelBookingInputs: cancelBookingApproveRequest
  ) {
    const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
      { _id: cancelBookingInputs._id },
      { ...cancelBookingInputs },
      { new: true }
    );

    if (cancelBookingResult) {
      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new ObjectId(cancelBookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: `Cancellation ${cancelBookingInputs.status}`,
          templateVariables: { action: `Cancellation ${cancelBookingInputs.status}` },
        };

        sendEmail(emailOptions);
      }

      return FormateData(cancelBookingResult);
    }
  }

  //delete cancelBooking by id
  async deleteCancelBookingById(
    cancelBookingInputs: cancelBookingDeleteRequest
  ) {
    const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
      { _id: cancelBookingInputs._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (cancelBookingResult) {

      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new ObjectId(cancelBookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
      ]);

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: "Cancellation Deleted",
          templateVariables: { action: "Cancellation Deleted" },
        };

        sendEmail(emailOptions);
      }

      return FormateData(cancelBookingResult);
    }
  }

  async getCountOfCancellationPerDay() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      let result = await cancelBookingModel.aggregate([
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
      console.log("Error in getting count of previous years weeks : ", error);
      return [];
    }
  }

  async getCountOfCancellationPerMonth() {
    try {
      // Set the startDate to the beginning of the month one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current month
      let endDate = moment().endOf("day").toISOString();

      let result = await cancelBookingModel.aggregate([
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
      console.log("Error in getting count of previous years weeks : ", error);
      return [];
    }
  }

  async getCountOfCancellationPerWeek() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      const result = await cancelBookingModel.aggregate([
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

export default CancelBookingRepository;
