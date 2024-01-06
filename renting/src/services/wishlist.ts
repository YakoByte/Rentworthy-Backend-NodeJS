import wishlistRepository from '../database/repository/wishlist';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { wishlistRequest, wishlistUpdateRequest, wishlistDeleteRequest, wishlistGetRequest } from '../interface/wishlist';

// All Business logic will be here
class wishlistService {
    private repository: wishlistRepository;

    constructor() {
        this.repository = new wishlistRepository();
    }
    // create wishlist
    async CreateWishlist(wishlistInputs: wishlistRequest) {
        try {
            const existingWishlist: any = await this.repository.CreateWishlist(
                wishlistInputs
            );

            return FormateData({ existingWishlist });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // get wishlist by id , userId or all wishlist
    async getWishlist(wishlistInputs: wishlistGetRequest) {
        try {
            let existingWishlist: any
            if (wishlistInputs._id) {
                existingWishlist = await this.repository.getWishlistById(
                    { _id: wishlistInputs._id }
                );
            } else if (wishlistInputs.userId) {
                existingWishlist = await this.repository.getWishlistByUserId(
                    { userId: wishlistInputs.userId }
                );
            } else {
                existingWishlist = await this.repository.getAllWishlist({
                    skip: Number(wishlistInputs.page) * Number(wishlistInputs.limit) - Number(wishlistInputs.limit),
                    limit: Number(wishlistInputs.limit)
                });
            }

            return FormateData({ existingWishlist });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    // add product
    async addProductToWishlist(wishlistInputs: wishlistRequest) {
        try {
            const existingWishlist: any = await this.repository.updateWishlist(
                { _id: wishlistInputs._id }, { $push: { productIds: wishlistInputs.productIds } }
            );
            return FormateData({ existingWishlist });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // remove product
    async removeProductFromWishlist(wishlistInputs: wishlistRequest) {
        try {
            const existingWishlist: any = await this.repository.updateWishlist(
                { _id: wishlistInputs._id }, { $pull: { productIds: wishlistInputs.productIds } }
            );
            return FormateData({ existingWishlist });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // delete wishlist
    async deleteWishlist(wishlistInputs: wishlistDeleteRequest) {
        try {
            const existingWishlist: any = await this.repository.deleteWishlist(
                wishlistInputs
            );

            return FormateData({ existingWishlist });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

}

export = wishlistService;
