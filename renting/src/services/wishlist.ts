import wishlistRepository from "../database/repository/wishlist";
import { FormateData, FormateError } from "../utils";

import {
  wishlistRequest,
  wishlistUpdateRequest,
  wishlistDeleteRequest,
  wishlistGetRequest,
} from "../interface/wishlist";

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

      return FormateData(existingWishlist);
    } catch (err: any) {
      return FormateError({ error: "Failed to create wishlist" });
    }
  }
  // get wishlist by id , userId or all wishlist
  async getWishlist(wishlistInputs: wishlistGetRequest) {
    try {
      let existingWishlist: any;
      if (wishlistInputs._id) {
        existingWishlist = await this.repository.getWishlistById({
          _id: wishlistInputs._id,
        });
      } else if (wishlistInputs.userId) {
        existingWishlist = await this.repository.getWishlistByUserId({
          userId: wishlistInputs.userId,
        });
      } else {
        existingWishlist = await this.repository.getAllWishlist({
          skip:
            Number(wishlistInputs.page) * Number(wishlistInputs.limit) -
              Number(wishlistInputs.limit) || 0,
          limit: Number(wishlistInputs.limit) || 10,
        });
      }

      return FormateData(existingWishlist);
    } catch (err: any) {
      return FormateError({ error: "Failed to Get wishlist" });
    }
  }

  // add product
  async addProductToWishlist(wishlistInputs: wishlistRequest) {
    try {
      const existingWishlist: any = await this.repository.updateWishlist(
        { userId: wishlistInputs.userId },
        { $push: { productIds: wishlistInputs.productIds } }
      );
      return FormateData(existingWishlist);
    } catch (err: any) {
      return FormateError({ error: "Failed to add product in wishlist" });
    }
  }

  // remove product
  async removeProductFromWishlist(wishlistInputs: wishlistRequest) {
    try {
      const existingWishlist: any = await this.repository.updateWishlist(
        { userId: wishlistInputs.userId },
        { $pull: { productIds: wishlistInputs.productIds } }
      );
      return FormateData(existingWishlist);
    } catch (err: any) {
      return FormateError({ error: "Failed to remove product from wishlist" });
    }
  }

  // delete wishlist
  async deleteWishlist(wishlistInputs: wishlistDeleteRequest) {
    try {
      const existingWishlist: any = await this.repository.deleteWishlist(
        wishlistInputs
      );

      return FormateData(existingWishlist);
    } catch (err: any) {
      return FormateError({ error: "Failed to delete wishlist" });
    }
  }
}

export = wishlistService;
