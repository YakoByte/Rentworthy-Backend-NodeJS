import { UserModel, paymentModel } from "../models";
import moment from "moment";
import { PaymentConfirmDetails, PaymentCount, UpdatePayment } from "../../interface/payment";

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

  async VerifyStripeId(stripeId: string, userId: string) {
    try {
      let response = await UserModel.findOneAndUpdate(
        { _id: userId },
        { isStripIdVerified: true, stripeId: stripeId },
        { new: true }
      );
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Verify StripeId");
    }
  }

  async getProductIdPaymentSum(paymentInput: PaymentCount) {
    try {
      const productId = paymentInput.productId;
      const result = await paymentModel.aggregate([
        { $match: { productId: productId } },
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
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to fetch payment Sum of productId");
    }
  }

  async getUserIdPaymentSum(paymentInput: PaymentCount) {
    const userId = paymentInput.userId;

    try {
      const result = await paymentModel.aggregate([
        { $match: { userId: userId } },
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
      throw new Error("Unable to fetch payment Sum of userId");
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

  async GetOwnerData(userID: string) {
    try {
      let response = await UserModel.findById(userID);
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to fetch Owner");
    }
  }

  async GetPaymentData(userId: string, paymentIntentId: string) {
    try {
      let response = await UserModel.findOne({userId, paymentIntentId});
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to fetch Payment");
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
}

export default PaymentRepository;
