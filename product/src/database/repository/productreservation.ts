import { productReservationModel } from "../models";
import {
  productReservationRequest,
  updateProductReservation,
  getAvailables,
} from "../../interface/productreservation";

class ProductReservationRepository {
  async CreateProductReservation(productInputs: productReservationRequest) {
    try {
      let tpStart = new Date(productInputs.startDate);
      let tpEnd = new Date(productInputs.endDate);
      let resp: any = [];
      while (tpStart <= tpEnd) {
        let tempObj = {
          productId: productInputs.productId,
          available: tpStart.getDate(),
          month: tpStart.getMonth() + 1,
          year: tpStart.getFullYear(),
        };
        resp.push(tempObj);
        tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
      }
      let temp: any = [];
      resp = resp.reduce((acc: any, one: any, i: any) => {
        if (
          resp[i + 1] &&
          resp[i + 1] &&
          resp[i + 1].month == one.month &&
          resp[i + 1].year == one.year
        ) {
          temp.push(one.available);
        } else {
          temp.push(one.available);
          acc.push({
            productId: one.productId,
            customerRes: [],
            selfRes: [],
            availableDates: [...temp],
            month: one.month,
            year: one.year,
          });
          temp = [];
        }
        return acc;
      }, []);
      await productReservationModel.insertMany(resp);
      return { message: "data added successfully" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create product reservation");
    }
  }

  async UpdateProductReservation(productInputs: updateProductReservation) {
    try {
      let tpStart = new Date(productInputs.startDate);
      let tpEnd = new Date(productInputs.endDate);
      let resp: any = [];
      while (tpStart <= tpEnd) {
        let tempObj = {
          productId: productInputs.productId,
          available: tpStart.getDate(),
          month: tpStart.getMonth() + 1,
          year: tpStart.getFullYear(),
        };
        resp.push(tempObj);
        tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
      }
      let temp: any = [];
      resp = resp.reduce((acc: any, one: any, i: any) => {
        if (
          resp[i + 1] &&
          resp[i + 1] &&
          resp[i + 1].month == one.month &&
          resp[i + 1].year == one.year
        ) {
          temp.push(one.available);
        } else {
          temp.push(one.available);
          acc.push({
            productId: one.productId,
            reserved: [...temp],
            month: one.month,
            year: one.year,
          });
          temp = [];
        }
        return acc;
      }, []);
      for (let oneObj of resp) {
        await productReservationModel.findOneAndUpdate(
          {
            productId: oneObj.productId,
            month: oneObj.month,
            year: oneObj.year,
          },
          {
            $push: {
              customerRes: oneObj.reserved,
            },
            $pull: {
              availableDates: {
                $in: oneObj.reserved,
              },
            },
          }
        );
      }
      return { message: "reservation done successfully" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update product reservation");
    }
  }

  async UpdateProductReservationSelf(productInputs: updateProductReservation) {
    try {
      let tpStart = new Date(productInputs.startDate);
      let tpEnd = new Date(productInputs.endDate);
      let resp: any = [];
      while (tpStart <= tpEnd) {
        let tempObj = {
          productId: productInputs.productId,
          available: tpStart.getDate(),
          month: tpStart.getMonth() + 1,
          year: tpStart.getFullYear(),
        };
        resp.push(tempObj);
        tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
      }
      let temp: any = [];
      resp = resp.reduce((acc: any, one: any, i: any) => {
        if (
          resp[i + 1] &&
          resp[i + 1] &&
          resp[i + 1].month == one.month &&
          resp[i + 1].year == one.year
        ) {
          temp.push(one.available);
        } else {
          temp.push(one.available);
          acc.push({
            productId: one.productId,
            reserved: [...temp],
            month: one.month,
            year: one.year,
          });
          temp = [];
        }
        return acc;
      }, []);
      for (let oneObj of resp) {
        await productReservationModel.findOneAndUpdate(
          {
            productId: oneObj.productId,
            month: oneObj.month,
            year: oneObj.year,
          },
          {
            $push: {
              selfRes: oneObj.reserved,
            },
            $pull: {
              availableDates: {
                $in: oneObj.reserved,
              },
            },
          }
        );
      }
      return { message: "self reservation done successfully" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update self reservation");
    }
  }

  async relieveProductReservation(productInputs: updateProductReservation) {
    try {
      let tpStart = new Date(productInputs.startDate);
      let tpEnd = new Date(productInputs.endDate);
      let resp: any = [];
      while (tpStart <= tpEnd) {
        let tempObj = {
          productId: productInputs.productId,
          available: tpStart.getDate(),
          month: tpStart.getMonth() + 1,
          year: tpStart.getFullYear(),
        };
        resp.push(tempObj);
        tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
      }
      let temp: any = [];
      resp = resp.reduce((acc: any, one: any, i: any) => {
        if (
          resp[i + 1] &&
          resp[i + 1] &&
          resp[i + 1].month == one.month &&
          resp[i + 1].year == one.year
        ) {
          temp.push(one.available);
        } else {
          temp.push(one.available);
          acc.push({
            productId: one.productId,
            reserved: [...temp],
            month: one.month,
            year: one.year,
          });
          temp = [];
        }
        return acc;
      }, []);
      for (let oneObj of resp) {
        await productReservationModel.findOneAndUpdate(
          {
            productId: oneObj.productId,
            month: oneObj.month,
            year: oneObj.year,
          },
          {
            $push: {
              availableDates: oneObj.reserved,
            },
            $pull: {
              // customerRes: oneObj.reserved
              customerRes: {
                $in: oneObj.reserved,
              },
            },
          }
        );
      }
      return { message: "self reservation done successfully" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to relieve product reservation");
    }
  }

  async GetAvailableDates(productInputs: getAvailables) {
    try {
      let response = await productReservationModel
        .find({
          productId: productInputs.productId,
        })
        .lean();
      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get availability date");
    }
  }
}

export default ProductReservationRepository;
