import { productRatingModel, historyModel } from "../models";

import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';

import { productRatingRequest, getProductRatingRequest } from "../../interface/productrating";


class ProductRatingRepository {

    async CreateProductRating(productInputs: productRatingRequest) {
        const findProduct = await productRatingModel.findOne({ productId: productInputs.productId, userId: productInputs.userId }).lean();
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