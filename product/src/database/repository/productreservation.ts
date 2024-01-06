import { productReservationModel } from "../models";

import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';

import { productReservationRequest, updateProductReservation, getAvailables } from "../../interface/productreservation";


class ProductReservationRepository {

    async CreateProductReservation(productInputs: productReservationRequest) {
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
        await productReservationModel.insertMany(resp)
        return FormateData("data added successfully")
    }

    async UpdateProductReservation(productInputs: updateProductReservation) {
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
            await productReservationModel.findOneAndUpdate({
                productId: oneObj.productId,
                month: oneObj.month,
                year: oneObj.year
            }, {
                $push: {
                    customerRes: oneObj.reserved
                },
                $pull: {
                    // availableDates: oneObj.reserved
                    availableDates: {
                        $in: oneObj.reserved
                    }
                }
            })

        }
        return FormateData("reservation done successfully")
    }

    async UpdateProductReservationSelf(productInputs: updateProductReservation) {
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
            await productReservationModel.findOneAndUpdate({
                productId: oneObj.productId,
                month: oneObj.month,
                year: oneObj.year
            }, {
                $push: {
                    selfRes: oneObj.reserved
                },
                $pull: {
                    availableDates: {
                        $in: oneObj.reserved
                    }
                }
            })

        }
        return FormateData("self reservation done successfully")
    }

    async relieveProductReservation(productInputs: updateProductReservation) {
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
            await productReservationModel.findOneAndUpdate({
                productId: oneObj.productId,
                month: oneObj.month,
                year: oneObj.year
            }, {
                $push: {
                    availableDates: oneObj.reserved
                },
                $pull: {
                    // customerRes: oneObj.reserved
                    customerRes: {
                        $in: oneObj.reserved
                    }
                }
            })

        }
        return FormateData("self reservation done successfully")
    }

    async GetAvailableDates(productInputs: getAvailables) {
        let response = await productReservationModel.find({
            productId: productInputs.productId
        }).lean()
        return FormateData(response)
    }
}

export default ProductReservationRepository;