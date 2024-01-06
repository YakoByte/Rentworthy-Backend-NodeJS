import { productLikeModel, historyModel } from "../models";

import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';

import { productLikeRequest, getProductLikeRequest } from "../../interface/productlike";


class ProductLikeRepository {

    async CreateProductLike(productInputs: productLikeRequest) {
        const findProduct = await productLikeModel.findOne({ productId: productInputs.productId, userId: productInputs.userId }).lean();
        const updateObj = {
            isFav: productInputs.isFav,
            isDeleted: productInputs.isFav ? false : true
        }
        if (findProduct) {
            const updateRes = await productLikeModel.findOneAndUpdate({
                _id: findProduct._id
            }, {
                $set: updateObj
            }, {
                new: true
            }).lean()
            return FormateData(updateRes)
        }
        const response = await productLikeModel.create(productInputs)
        const history = new historyModel({
            productId: response.productId,
            log: [
                {
                    objectId: response._id,
                    data: {
                        userId: productInputs.userId,
                    },
                    action: `Like was created for this product id ${response.productId}`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();
        return FormateData(response)
    }

    async GetProductLikes(productInputs: getProductLikeRequest) {
        let searchQuery: getProductLikeRequest = {}
        if (productInputs.userId) {
            searchQuery.userId = productInputs.userId
        }
        if (productInputs.productId) {
            searchQuery.productId = productInputs.productId
        }
        let getRes = await productLikeModel.find(searchQuery).lean()
        return FormateData(getRes)
    }
}

export default ProductLikeRepository;