import { UserModel, paymentModel } from "../models";
import moment from "moment";
import { FormateData } from "../../utils";
import { PaymentConfirmDetails, PaymentCount } from "../../interface/payment";

class PaymentRepository {
  async CreatePayment(PaymentInputs: PaymentConfirmDetails) {
    try {
      let response = await paymentModel.create(PaymentInputs);
      return FormateData(response);
    } catch (err) {
      console.log("err", err);
      return err;
    }
  }

  async VerifyStripeId(stripeId: string, userId: string) {
    try {
      let response = await UserModel.findOneAndUpdate(
        { _id: userId },
        { isStripIdVerified: true, stripeId: stripeId },
        { new: true }
      );
      return FormateData(response);
    } catch (err) {
      console.error("Error:", err);
      return err;
    }
  }

  async getProductIdPaymentSum(paymentInput: PaymentCount) {
    const productId = paymentInput.productId;
    console.log(productId);

    try {
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

      return FormateData(totalAmount);
    } catch (error) {
      console.error("Error in getProductIdPaymentSum:", error);
      return 0;
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

      return FormateData(totalAmount);
    } catch (error) {
      console.error("Error in getUserIdPaymentSum:", error);
      return 0;
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

      return FormateData(totalAmount);
    } catch (error) {
      console.error("Error in getUserIdPaymentSum:", error);
      return 0;
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
      console.log("Error in getting count of previous years weeks : ", error);
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
      console.log("Error in getting count of previous years weeks : ", error);
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
      console.log("Error in getting count of previous years weeks : ", error);
      return [];
    }
  }
}

export default PaymentRepository;
