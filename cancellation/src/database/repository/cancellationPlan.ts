import { cancellationPlanModel, productModel, historyModel } from "../models";
import moment from "moment";
import {
  cancellationPlanRequest,
  cancellationPlanGetRequest,
  cancellationPlanUpdateRequest,
  cancellationPlanDeleteRequest,
} from "../../interface/cancellationPlan";

class CancellationPlanRepository {
  //create cancellationPlan
  async CreateCancellationPlan(
    cancellationPlanInputs: cancellationPlanRequest
  ) {
    try {
      const cancellationPlan = await cancellationPlanModel.create(
        cancellationPlanInputs
      );
      return cancellationPlan;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Cancellation plan");
    }
  }
  
  //get cancellationPlan by id , all cancellationPlan
  async getAllCancellationPlan(
    cancellationPlanInputs: cancellationPlanGetRequest
  ) {
    try {
      let cancellationPlan: any;
      if (cancellationPlanInputs._id) {
        cancellationPlan = await cancellationPlanModel.findOne({
          _id: cancellationPlanInputs._id,
          isDeleted: false,
        });
      } else {
        cancellationPlan = await cancellationPlanModel.find({
          isDeleted: false,
        });
      }
      return cancellationPlan;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get Cancellation plan");
    }
  }

  //update cancellationPlan by id
  async updateCancellationPlanById(
    cancellationPlanInputs: cancellationPlanUpdateRequest
  ) {
    try {
      const cancellationPlanResult =
        await cancellationPlanModel.findOneAndUpdate(
          { _id: cancellationPlanInputs._id, isDeleted: false },
          { ...cancellationPlanInputs },
          { new: true }
        );
      if (cancellationPlanResult) {
        return cancellationPlanResult;
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to update Cancellation plan");
    }
  }

  //delete cancellationPlan by id
  async deleteCancellationPlanById(
    cancellationPlanInputs: cancellationPlanDeleteRequest
  ) {
    try {
      const cancellationPlanResult =
        await cancellationPlanModel.findOneAndUpdate(
          { _id: cancellationPlanInputs._id, isDeleted: false },
          { isDeleted: true },
          { new: true }
        );
      if (cancellationPlanResult) {
        return cancellationPlanResult;
      }
      return { message: "Data not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Delete Cancellation plan");
    }
  }

  // get count of cancellation of plan in every day
  async getCountOfCancellationPerDay() {
    try {
      // Set the startDate to the beginning of the day one year ago
      let startDate = moment()
        .subtract(1, "years")
        .startOf("day")
        .toISOString();

      // Set the endDate to the end of the current day
      let endDate = moment().endOf("day").toISOString();

      let result = await cancellationPlanModel.aggregate([
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
      console.error("Error in getCountOfCancellationPerDay:", error);
      return [];
    }
  }
}

export default CancellationPlanRepository;
