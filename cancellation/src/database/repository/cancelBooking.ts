import { cancelBookingModel, cancellationPlanModel, BookingModel } from "../models";
import { Types } from "mongoose";
import moment from "moment";
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
      const existingCancelBooking = await cancelBookingModel.findOne({bookingId: cancelBookingInputs.bookingId, isDeleted: false});
      if(existingCancelBooking) {
        return { message: "Booking already Cancelled" };
      }

      const existingBooking = await BookingModel.findById(cancelBookingInputs.bookingId);
      if(!existingBooking) {
        return { message: "Booking not found" };
      }

      const existingCacellationPlan = await cancellationPlanModel.findById(cancelBookingInputs.cancellationPolicyId);
      if(!existingCacellationPlan) {
        return { message: "Cancellation plan not found" };
      }

      if(existingBooking.price <= existingCacellationPlan.minimumCharges) {
        return { message: 'The booking price must be greater than or equal to the cancellation plan price' };  
      }

      const bookingTime = Date.now() - existingBooking?.bookingTime.getTime();
      const maximumCancellationHoursMillis = existingCacellationPlan.maximumCancellationHours * 60 * 60 * 1000;

      if (bookingTime > maximumCancellationHoursMillis) {
        return { message: 'The booking time must be less than or equal to the cancellation plan maximum time' };  
      }

      if(existingCacellationPlan.cancellationChargesType === 'Percentage') {
        cancelBookingInputs.cancellationCharges = `${(existingCacellationPlan.cancellationCharges / 100) * existingBooking.price}`;
        cancelBookingInputs.cancellationAmount = `${existingBooking.price - ((existingCacellationPlan.cancellationCharges / 100) * existingBooking.price)}`;
      } else if(existingCacellationPlan.cancellationChargesType === 'Fixed') {
        cancelBookingInputs.cancellationCharges = `${existingCacellationPlan.cancellationCharges}`;
        cancelBookingInputs.cancellationAmount = `${existingBooking.price - (existingCacellationPlan.cancellationCharges)}`;
      }

      const cancelBooking = await cancelBookingModel.create(cancelBookingInputs);

      const findUser: any = await cancelBookingModel.aggregate([
        { $match: { _id: new Types.ObjectId(cancelBooking._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" }
      ]);      

      if (findUser[0].user.email) {
        const emailOptions = {
          toUser: findUser[0].user.email,
          subject: "Cancellation Initiated",
          templateVariables: { action: "Cancellation Initiated" },
        };

        sendEmail(emailOptions);
      }

      return cancelBooking;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Booking");
    }
  }

  //get cancelBooking by id , all cancelBooking
  async getAllCancelBooking(cancelBookingInputs: cancelBookingGetRequest) {
    try {
      let skip = Number(cancelBookingInputs.page) * Number(cancelBookingInputs.limit) - Number(cancelBookingInputs.limit) || 0;
      let limit = Number(cancelBookingInputs.limit) || 10;
      let cancelBooking: any;
      if (cancelBookingInputs._id) {
        cancelBooking = await cancelBookingModel.findOne({
          _id: new Types.ObjectId(cancelBookingInputs._id),
          isDeleted: false
        }).populate('cancellationPolicyId');
      } else if(cancelBookingInputs.userId) {
        cancelBooking = await cancelBookingModel.find({
          userId: new Types.ObjectId(cancelBookingInputs.userId),
          isDeleted: false
        }).populate('cancellationPolicyId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      } else if(cancelBookingInputs.user?._id) {
        cancelBooking = await cancelBookingModel.find({
          userId: new Types.ObjectId(cancelBookingInputs.user._id),
          isDeleted: false
        })
        .populate('cancellationPolicyId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      } else {
        cancelBooking = await cancelBookingModel.find({
          isDeleted: false
        }).populate('cancellationPolicyId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      }

      return cancelBooking;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get Booking");
    }
  }

  //update cancelBooking by id
  async updateCancelBookingById(cancelBookingInputs: cancelBookingUpdateRequest) {
    try {
    const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
      { _id: new Types.ObjectId(cancelBookingInputs._id) },
      { ...cancelBookingInputs },
      { new: true }
    );

    if (cancelBookingResult) {
      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new Types.ObjectId(cancelBookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "userId" }
      ]);

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: `Cancellation ${cancelBookingInputs.status}`,
          templateVariables: { action: `Cancellation ${cancelBookingInputs.status}` },
        };

        sendEmail(emailOptions);
      }
      
      return cancelBookingResult;
    }
    return { message: "Data not found" };
  } catch (error) {
    console.log("error", error);
    throw new Error("Unable to update Booking");
  }
  }

  async approveRejectCancelBookingById(cancelBookingInputs: cancelBookingApproveRequest) {
    try {
      const existingCancelBooking = await cancelBookingModel.findOne({_id: new Types.ObjectId(cancelBookingInputs._id), isDeleted: false});
      if(existingCancelBooking) {
        return { message: "Booking Already Cancelled " };
      }
  
      const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
        { _id: new Types.ObjectId(cancelBookingInputs._id) },
        { ...cancelBookingInputs },
        { new: true }
      );
  
      if (cancelBookingResult) {
        const findUser = await cancelBookingModel.aggregate([
          { $match: { _id: new Types.ObjectId(cancelBookingResult._id), isDeleted: false } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          { $unwind: "$user" }
        ]);      
  
        if (findUser[0].user.email) {
          const emailOptions = {
            toUser: findUser[0].user.email,
            subject: `Cancellation ${cancelBookingInputs.status}`,
            templateVariables: { action: `Cancellation ${cancelBookingInputs.status}` },
          };
  
          sendEmail(emailOptions);
        }
  
        return cancelBookingResult;
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to approve Booking");
    }
  }

  //delete cancelBooking by id
  async deleteCancelBookingById(cancelBookingInputs: cancelBookingDeleteRequest) {
    try {
      const existingCancelBooking = await cancelBookingModel.findOne({_id: new Types.ObjectId(cancelBookingInputs._id), isApproved: true});
      if(existingCancelBooking) {
        return { message: "Cancellation Can't Delete " };
      }

    const cancelBookingResult = await cancelBookingModel.findOneAndUpdate(
      { _id: new Types.ObjectId(cancelBookingInputs._id), isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (cancelBookingResult) {
      const findUser = await cancelBookingModel.aggregate([
        { $match: { _id: new Types.ObjectId(cancelBookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" }
      ]);      

      if (findUser[0].user.email) {
        const emailOptions = {
          toUser: findUser[0].user.email,
          subject: "Cancellation Deleted",
          templateVariables: { action: "Cancellation Deleted" },
        };

        sendEmail(emailOptions);
      }

      return cancelBookingResult;
    }
    return { message: "Data not found" };
  } catch (error) {
    console.log("error", error);
    throw new Error("Unable to delete Booking");
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
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        }
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
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
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
        {
          $sort: { "_id.year": 1, "_id.week": 1 }
        }
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
