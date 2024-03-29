import {
  expandDatesModel,
  bookingModel,
  productModel,
  historyModel,
} from "../models";
import {
  expandDateRequest,
  expandDateGetRequest,
  expandDateUpdateRequest,
} from "../../interface/expandDate";
import { generatePresignedUrl } from "../../utils/aws";

class ExpandDateRepository {
  //create expandDate
  async CreateExpandDate(expandDateInputs: expandDateRequest) {
    let expandDateResult;
    try {
      //check product's date already booked or product is exist in expandDate
      let product = await productModel.findOne({
        _id: expandDateInputs.productId,
        quantity: { $gte: expandDateInputs.quantity },
        $and: [
          { "rentingDate.startDate": { $lte: expandDateInputs.startDate } },
          { "rentingDate.endDate": { $gte: expandDateInputs.endDate } },
        ],
        isDeleted: false,
      });
      console.log("product", product);
      if (!product) {
        return { message: "Product not available in this Date" };
      }
      // already booked
      let findSameBooking = await bookingModel.find({
        // $or: [
        //     {
        $and: [
          { startDate: { $gte: expandDateInputs.startDate } },
          { endDate: { $lte: expandDateInputs.endDate } },
          { productId: expandDateInputs.productId },
        ],
        //     },
        // ]
      });
      if (findSameBooking && findSameBooking.length > 0) {
        return { message: "Product already booked" };
      }

      //already expanded
      let findSameExpandDate = await expandDatesModel.find({
        // $or: [
        //     {
        $and: [
          { startDate: { $gte: expandDateInputs.startDate } },
          { endDate: { $lte: expandDateInputs.endDate } },
          { productId: expandDateInputs.productId },
        ],
        //     },
        // ]
      });
      if (findSameExpandDate && findSameExpandDate.length > 0) {
        return { message: "Product already booked" };
      }
      // check quantity is available or not from expandDate and booking
      let findAllBooking = await bookingModel.find({
        productId: expandDateInputs.productId,
        isDeleted: false,
      });
      let findAllExpandDate = await expandDatesModel.find({
        productId: expandDateInputs.productId,
        isDeleted: false,
      });
      // find all quantity from booking and expandDate
      let totalQuantity = 0;
      findAllBooking.forEach((element: any) => {
        totalQuantity += element.quantity;
      });
      findAllExpandDate.forEach((element: any) => {
        totalQuantity += element.quantity;
      });
      console.log("totalQuantity", totalQuantity);
      if (
        totalQuantity + Number(expandDateInputs.quantity) >
        Number(product.quantity)
      ) {
        return { message: "All the Products Are Booked" };
      }
      // create expandDate
      const expandDate = new expandDatesModel(expandDateInputs);
      expandDateResult = await expandDate.save();

      return expandDateResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Expand Date");
    }
  }

  //get all expandDate
  async getAllExpandDate(expandDateInputs: expandDateGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      if (expandDateInputs._id) {
        criteria._id = expandDateInputs._id;
      }
      if (expandDateInputs.user.roleName === "user") {
        criteria.userId = expandDateInputs.user._id;
      }
      if (expandDateInputs.productId) {
        criteria.productId = expandDateInputs.productId;
      }
      if (expandDateInputs.startDate && expandDateInputs.endDate) {
        criteria.$and = [
          { startDate: { $gte: expandDateInputs.startDate } },
          { endDate: { $lte: expandDateInputs.endDate } },
        ];
      }
      console.log("criteria", criteria);
      // const findExpandDate = await expandDatesModel.find(criteria);
      const findExpandDate = await expandDatesModel.aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            productId: 1,
            startDate: 1,
            endDate: 1,
            quantity: 1,
            isAccepted: 1,
            image: 1,
            acceptedBy: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            product: {
              _id: 1,
              name: 1,
              description: 1,
              quantity: 1,
              price: 1,
              images: 1,
              isDeleted: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            user: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              address: 1,
              isDeleted: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
      ]);

      if (findExpandDate) {
        await Promise.all(
          findExpandDate.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findExpandDate;
      }
      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Expand Date");
    }
  }

  //add images to expandDate
  async addImagesToExpandDate(expandDateInputs: expandDateRequest) {
    try {
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { $push: { images: expandDateInputs.images } },
        { new: true }
      );
      if (expandDateResult) {
        return expandDateResult;
      }
      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to add image to Expand Date");
    }
  }

  //remove images from expandDate
  async removeImagesFromExpandDate(expandDateInputs: expandDateRequest) {
    try {
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { $pull: { images: expandDateInputs.images } },
        { new: true }
      );
      if (expandDateResult) {
        return expandDateResult;
      }
      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to remove image from Expand Date");
    }
  }

  //update expandDate by id
  async updateExpandDateById(expandDateInputs: expandDateRequest) {
    try {
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { ...expandDateInputs },
        { new: true }
      );
      if (expandDateResult) {
        return expandDateResult;
      }
      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update Expand Date");
    }
  }

  //approve expandDate by product owner
  async approveExpandDate(expandDateInputs: expandDateUpdateRequest) {
    try {
      //check expandDate is exist or not
      let expandDate = await expandDatesModel.findOne({
        _id: expandDateInputs._id,
        isDeleted: false,
      });
      if (!expandDate) {
        return { message: "ExpandDate not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: expandDate.productId,
        userId: expandDateInputs.acceptedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { isAccepted: true, acceptedBy: expandDateInputs.acceptedBy },
        { new: true }
      );
      if (expandDateResult) {
        // add expandDates id to booking
        await bookingModel.findOneAndUpdate(
          { _id: expandDate.bookingId, isDeleted: false },
          { expandId: expandDateResult._id },
          { new: true }
        );
        return expandDateResult;
      }

      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to approve Expand Date");
    }
  }

  // reject expandDate by product owner
  async rejectExpandDate(expandDateInputs: expandDateUpdateRequest) {
    try {
      //check expandDate is exist or not
      let expandDate = await expandDatesModel.findOne({
        _id: expandDateInputs._id,
        isDeleted: false,
      });
      if (!expandDate) {
        return { message: "ExpandDate not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: expandDate.productId,
        userId: expandDateInputs.acceptedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { isAccepted: false, acceptedBy: expandDateInputs.acceptedBy },
        { new: true }
      );
      if (expandDateResult) {
        return expandDateResult;
      }
      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to reject Expand Date");
    }
  }

  //delete expandDate by id
  async deleteExpandDateById(expandDateInputs: { _id: string }) {
    try {
      const expandDateResult = await expandDatesModel.findOneAndUpdate(
        { _id: expandDateInputs._id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (expandDateResult) {
        return expandDateResult;
      }

      return { message: "Expand Date not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to delete Expand Date");
    }
  }
}

export default ExpandDateRepository;
