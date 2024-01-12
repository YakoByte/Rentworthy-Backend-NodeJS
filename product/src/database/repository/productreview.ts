import { productReviewModel, historyModel } from "../models";

import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';

import { productReviewRequest, getProductReviewRequest, AuthenticatedRequest } from "../../interface/productreview";
import axios from "axios";


class ProductReviewRepository {

    async CreateProductReview(productInputs: any) {
        const findProduct = await productReviewModel.findOne({ productId: productInputs.productId, userId: productInputs.userId }).lean();
        let tempBody: any = {
            productId: productInputs.productId,
            userId: productInputs.userId
        }
        console.log("productInputs.token", productInputs.token)
        console.log("tempBody", tempBody)
        let bookings = await axios.get("http://localhost:5000/app/api/v1/renting/get-booking",
            {
                params: tempBody,
                headers: {
                    'Authorization': productInputs.token
                }
            }
        )
        console.log('booking----', bookings.data.data)
        if (bookings.data.data.length) {
            if (findProduct) {
                const updateRes = await productReviewModel.findOneAndUpdate({
                    _id: findProduct._id
                }, {
                    $set: {
                        review: productInputs.review
                    }
                }, {
                    new: true
                }).lean()
                return FormateData(updateRes)
            }
            const response = await productReviewModel.create(productInputs)
            const history = new historyModel({
                productId: response.productId,
                log: [
                    {
                        objectId: response._id,
                        data: {
                            userId: productInputs.userId,
                        },
                        action: `Review was created for this product id ${response.productId}`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();
            return FormateData(response)
        } else {
            console.log("there needs to be a booking before giving review.")
            return FormateData("there needs to be a booking before giving review.")
        }
    }

    async GetProductReview(productInputs: getProductReviewRequest) {
        let searchQuery: getProductReviewRequest = {}
        if (productInputs.userId) {
            searchQuery.userId = productInputs.userId
        }
        if (productInputs.productId) {
            searchQuery.productId = productInputs.productId
        }
        let getRes = await productReviewModel.find(searchQuery).lean()
        return FormateData(getRes)
    }
}

export default ProductReviewRepository;