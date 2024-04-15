import { UserModel, paymentModel } from "../models";
import moment from "moment";
import { GetAllPayment, PaymentConfirmDetails, UpdatePayment } from "../../interface/payment";
import { Types } from "mongoose";

class PaymentRepository {
  async CreatePayment(PaymentInputs: PaymentConfirmDetails) {
    try {
      let response = await paymentModel.create(PaymentInputs);
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Payment");
    }
  }

  async GetPaymentData(paymentId: string) {
    try {
      let response = await paymentModel.findOne({paymentId: paymentId});
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Payment");
    }
  }

  async VerifyAccountStripeId(account_Id: string, userId: string) {
    try {
      let response = await UserModel.findOneAndUpdate(
        { _id: userId },
        { isStripeAccountVerified: true, stripAccountId: account_Id },
        { new: true }
      );
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Verify StripeId");
    }
  }

  async getAccountDetail(customer_Id: string) {
    try {
      const response = await UserModel.findOne({stripeCustomerId: customer_Id});
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Verify StripeId");
    }
  }

  async VerifyCustomerStripeId(customer_Id: string, userId: string) {
    try {
      let response = await UserModel.findOneAndUpdate(
        { _id: userId },
        { isStripeCustomerVerified: true, stripeCustomerId: customer_Id },
        { new: true }
      );
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Verify StripeId");
    }
  }
  
  async getPaymentSum() {
    try {
      const result = await paymentModel.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$price" },
          },
        },
      ]);

      // Extract the totalAmount from the result
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      return totalAmount;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to fetch payment Sum");
    }
  }

  async getCountOfPaymentPerDay() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      let result = await paymentModel.aggregate([
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
      console.log("Error in getting count of payment of day : ", error);
      return [];
    }
  }

  async getCountOfPaymentPerMonth() {
    try {
      // Set the startDate to the beginning of the month one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current month
      let endDate = moment().endOf("day").toISOString();

      let result = await paymentModel.aggregate([
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
      console.log("Error in getting count of payment of Month : ", error);
      return [];
    }
  }

  async getCountOfPaymentPerWeek() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      const result = await paymentModel.aggregate([
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
      console.log("Error in getting count of payment of week : ", error);
      return [];
    }
  }

  async GetOwnerData(_id: string) {
    try {
      let response = await UserModel.findById(_id);
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to fetch Owner");
    }
  }

  async UpdatePaymentData(paymentDetail: UpdatePayment) {
    try {
      let response = await paymentModel.findByIdAndUpdate(paymentDetail._id, paymentDetail, { new: true });
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update Payment");
    }
  }  

  async GetAllPayment(paymentDetail: GetAllPayment) {
    try {
      let criteria: any = { isDeleted: false }
      if(paymentDetail?.userId){
        criteria.userId = new Types.ObjectId(paymentDetail.userId)
      }
      if (paymentDetail.user.roleName === "user") {
        criteria.userId = new Types.ObjectId(paymentDetail.user._id);
      }
      if (paymentDetail?._id) {
        criteria._id = new Types.ObjectId(paymentDetail._id);
      }
      if (paymentDetail?.paymentId) {
        criteria.paymentId = new Types.ObjectId(paymentDetail.paymentId);
      }

      let response = await paymentModel.find(criteria);
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Fetch Payment");
    }
  }
}

export default PaymentRepository;
