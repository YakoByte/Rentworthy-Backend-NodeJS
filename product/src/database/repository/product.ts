import { productModel, historyModel } from "../models";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { productRequest, productDeleteRequest, productUpdateRequest, productGetRequest } from "../../interface/product";
import { populate } from "dotenv";
class ProductRepository {
    //create product
    async CreateProduct(productInputs: productRequest) {
        // try {
        const findProduct = await productModel.findOne({ name: productInputs.name });
        console.log("findProduct", findProduct)
        if (findProduct) {
            return FormateData({ id: findProduct._id, name: findProduct.name });
        }

        const product = new productModel(productInputs);
        const productResult = await product.save();

        const history = new historyModel({
            productId: productResult._id,
            log: [
                {
                    objectId: productResult._id,
                    data: {
                        userId: productInputs.userId,
                    },
                    action: `productName = ${productInputs.name} created`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();

        return productResult;
        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }
    //get product by id
    async getProductById(productInputs: { _id: string }) {
        try {
            const findProduct = await productModel.aggregate([
                { $match: { _id: productInputs._id, isDeleted: false, isActive: true } },
                {
                    $lookup: {
                        from: "images",
                        localField: "images",
                        foreignField: "_id",
                        pipeline: [{ $project: { path: 1, _id: 0 } }],
                        as: "images"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        pipeline: [{ $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } }],
                        as: "userId"
                    }
                }
            ])
            console.log("findProduct", findProduct)
            if (findProduct) {
                return { STATUS_CODE: STATUS_CODES.OK, data: findProduct };
            }
        } catch (err: any) {
            return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, data: [], message: err.message })
        }
    }
    // get product by category id
    async getProductByCategoryId(productInputs: productGetRequest) {
        try {
            const findProduct = await productModel.find({ categoryId: productInputs.categoryId, isDeleted: false, isActive: true }).populate("images");
            console.log("findProduct", findProduct)
            if (findProduct) {
                return FormateData(findProduct);
            }
        } catch (err: any) {
            return new BadRequestError("Data Not found", err);
        }
    }
    // get product by subcategory id
    async getProductBySubCategoryId(productInputs: productGetRequest) {
        const findProduct = await productModel.find({ subCategoryId: productInputs.subCategoryId, isDeleted: false, isActive: true }).populate("images");
        console.log("findProduct", findProduct)
        if (findProduct) {
            return FormateData(findProduct);
        }
    }
    //get all product
    async getAllProduct({ skip, limit }: { skip: number, limit: number }) {
        try {
            console.log("skip", skip, "limit", limit)
            const findProduct = await productModel.aggregate([
                { $match: { isDeleted: false, isActive: true } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "images",
                        localField: "images",
                        foreignField: "_id",
                        pipeline: [{ $project: { path: 1, _id: 0 } }],
                        as: "images"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        pipeline: [{ $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } }],
                        as: "userId"
                    }
                }
            ])
            console.log("findProduct", findProduct)
            if (findProduct) {
                return ({ STATUS_CODE: STATUS_CODES.OK, data: findProduct });
            }
        } catch (err: any) {
            return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, data: [], message: err.message })
        }
    }
    // get product by name and search using regex
    async getProductByName(productInputs: { name: string }) {
        const findProduct = await productModel.find({ name: { $regex: productInputs.name, $options: 'i' }, isDeleted: false, isActive: true }).populate("images");
        console.log("findProduct", findProduct)
        if (findProduct) {
            return FormateData(findProduct);
        }
    }
    //update product name, description, isActive, isShow, image
    async updateProduct(productInputs: productUpdateRequest) {
        const findProduct = await productModel.findOne({ _id: productInputs._id, isDeleted: false });
        console.log("findProduct", findProduct)
        if (findProduct) {
            const productResult = await productModel.updateOne({ _id: productInputs._id }, productInputs);
            // console.log("productResult", productResult)
            const history = new historyModel({
                productId: productInputs._id,
                log: [
                    {
                        objectId: productInputs._id,
                        userId: productInputs.userId,
                        action: `productName = ${productInputs.name} updated`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();
            return { STATUS_CODES: STATUS_CODES.OK, data: "Product Updated" };
        }
    }

    async deleteProduct(productInputs: productDeleteRequest) {
        const findProduct = await productModel.findOne({ _id: productInputs._id, isDeleted: false });
        console.log("findProduct", findProduct)
        if (findProduct) {
            // soft delete product
            const productResult = await productModel.updateOne({ _id: productInputs._id }, { isDeleted: true });
            // soft delete subproduct
            // const subproductResult = await subProductModel.updateMany({ productId: productInputs._id }, { isDeleted: true });
            // console.log("subproductResult", subproductResult)
            //create history
            const history = new historyModel({
                productId: productInputs._id,
                log: [
                    {
                        objectId: productInputs._id,
                        userId: productInputs.userId,
                        action: `productName = ${findProduct.name} deleted and subproduct also deleted`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();
            return FormateData({ message: "Product Deleted" });
        }
    }

}

export default ProductRepository;
