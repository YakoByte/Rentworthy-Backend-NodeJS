import { productRatingModel, historyModel } from "../models";

import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';

import { productRatingRequest, getProductRatingRequest, AuthenticatedRequest } from "../../interface/productrating";
import axios from "axios";


class ProductRatingRepository {

    async CreateProductRating(productInputs: productRatingRequest, req: AuthenticatedRequest) {
        const findProduct = await productRatingModel.findOne({ productId: productInputs.productId, userId: productInputs.userId }).lean();
        let tempBody: any = {
            productId: productInputs.productId,
            userId: productInputs.userId
        }
        let bookings = await axios.get("http://localhost:5000/app/api/v1/renting/get-booking",
            {
                params: tempBody,
                headers: {
                    'Authorization': req.headers.authorization
                }
            }
        )
        console.log('booking----', bookings.data.existingBooking.data.length)
        if (bookings.data.existingBooking.data.length) {
            if (findProduct) {
                const updateRes = await productRatingModel.findOneAndUpdate({
                    _id: findProduct._id
                }, {
                    $set: {
                        rating: productInputs.rating
                    }
                }, {
                    new: true
                }).lean()
                return FormateData(updateRes)
            }
            const response = await productRatingModel.create(productInputs)
            const history = new historyModel({
                productId: response.productId,
                log: [
                    {
                        objectId: response._id,
                        data: {
                            userId: productInputs.userId,
                        },
                        action: `Rating was created for this product id ${response.productId}`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();
            return FormateData(response)
        } else {
            return FormateData("there needs to be a booking before rating it.")
        }
    }

    async GetProductRating(productInputs: getProductRatingRequest) {
        let searchQuery: getProductRatingRequest = {}
        if (productInputs.userId) {
            searchQuery.userId = productInputs.userId
        }
        if (productInputs.productId) {
            searchQuery.productId = productInputs.productId
        }
        let getRes = await productRatingModel.find(searchQuery).lean()
        return FormateData(getRes)
    }
}

export default ProductRatingRepository;