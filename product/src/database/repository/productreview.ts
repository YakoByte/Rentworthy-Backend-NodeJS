import { productReviewModel, historyModel } from "../models";

import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';

import { productReviewRequest, getProductReviewRequest } from "../../interface/productreview";


class ProductReviewRepository {

    async CreateProductReview(productInputs: productReviewRequest) {
        const findProduct = await productReviewModel.findOne({ productId: productInputs.productId, userId: productInputs.userId }).lean();
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