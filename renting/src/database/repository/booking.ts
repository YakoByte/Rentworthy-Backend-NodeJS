import { bookingModel, productModel, historyModel } from "../models";
import axios from 'axios';

import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { bookingRequest, bookingGetRequest, bookingUpdateRequest, postAuthenticatedRequest, recentBookingGetRequest, approveAuthenticatedRequest, bookingRequestWithPayment } from "../../interface/booking";
class BookingRepository {
    //create booking
    async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
        let bookingResult
        try {
            //check product's date already booked or product is exist in booking
            let product = await productModel.findOne(
                {
                    _id: bookingInputs.productId,
                    quantity: { $gte: bookingInputs.quantity },
                    $and: [{ "rentingDate.startDate": { $lte: bookingInputs.startDate } }, { "rentingDate.endDate": { $gte: bookingInputs.endDate } }],
                    isDeleted: false
                });
            console.log("product", product)
            if (!product) {
                return FormateData({ message: "Product not available in this Date" });
            }
            //already booked
            let findSameBooking = await bookingModel.find(
                {
                    // $or: [
                    //     {
                    $and: [
                        { startDate: { $gte: bookingInputs.startDate } },
                        { endDate: { $lte: bookingInputs.endDate } },
                        { productId: bookingInputs.productId }]
                    //     },
                    // ]
                });
            if (findSameBooking && findSameBooking.length > 0) {
                return FormateData({ message: "Product already booked" });
            }
            // check quantity is available or not
            let findAllBooking = await bookingModel.find(
                {
                    productId: bookingInputs.productId,
                    isDeleted: false
                });
            console.log("findAllBooking", findAllBooking)
            let totalQuantity = 0
            findAllBooking.forEach((element: any) => {
                totalQuantity += element.quantity
            });
            console.log("totalQuantity", totalQuantity)
            if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {
                return FormateData({ message: "All the Products Are Booked" });
            }

            // console.log("findAllBooking", findAllBooking)
            // let paymentObj = {
            //     paymentMethodId: bookingInputs.paymentMethodId,
            //     productId: bookingInputs.productId,
            //     paymentIntentId: bookingInputs.paymentIntentId,
            //     userId: bookingInputs.userId,
            //     quantity: bookingInputs.quantity,
            //     price: bookingInputs.totalAmount
            // }
            // let paymentStatus: any = await axios.post("http://localhost:5007/app/api/v1/payment/confirm-payment-intent", paymentObj, {
            //     headers: {
            //         Authorization: req.headers.token
            //     }
            // })
            // if (paymentStatus.payStatus == "succeeded") {
            // let tempObj: bookingRequestWithPayment = { ...bookingInputs, paymentId: paymentStatus.paymentId }
            let tempObj: bookingRequestWithPayment = { ...bookingInputs }
            const booking = new bookingModel(tempObj);
            bookingResult = await booking.save();
            if (bookingResult) {
                let tempBody = {
                    productId: bookingInputs.productId,
                    startDate: bookingInputs.startDate,
                    endDate: bookingInputs.endDate,
                }
                await axios.post("http://localhost:5000/app/api/v1/product/update-productreservation", tempBody, {
                    headers: {
                        'Authorization': req.headers.authorization,
                        'Content-Type': 'application/json',
                    }
                })
            }
            return bookingResult;
            // } else {
            //     return FormateData({ message: "Something went wrong with the payment." });
            // }
        } catch (err) {
            console.log("err", err)
            return err;
        }
    }
    // get active booking, panding, completed, requested
    async getBooking(bookingInputs: bookingGetRequest) {
        let criteria: any = { isDeleted: false };
        if (bookingInputs.status == "active") {
            criteria.status = "pending"
        } else if (bookingInputs.status == "completed") {
            criteria.status = bookingInputs.status;
        } else if (bookingInputs.status == "requested") {
            criteria.status = "accepted";
        }
        console.log("criteria", criteria)
        const findBooking = await bookingModel.find(criteria);
        console.log("findBooking", findBooking)
        if (findBooking) {
            return FormateData(findBooking);
        } else {
            return FormateData({ message: "Booking not found" });
        }
    }
    // get recent booking
    async getRecentBooking(bookingInputs: recentBookingGetRequest) {
        let criteria: any = { isDeleted: false };
        if (bookingInputs._id) {
            criteria._id = bookingInputs._id;
        }
        if (bookingInputs.productId) {
            criteria.productId = bookingInputs.productId;
        }
        if (bookingInputs.startDate && bookingInputs.endDate) {
            criteria.$and = [
                { startDate: { $gte: bookingInputs.startDate } },
                { endDate: { $lte: bookingInputs.endDate } }
            ]
        }
        console.log("criteria", criteria)
        //add user detail and product detail in booking
        const findBooking = await bookingModel.aggregate([
            {
                $match: criteria
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetail"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetail"
                }
            },
            {
                $unwind: "$userDetail"
            },
            {
                $unwind: "$productDetail"
            },
            {
                $project: {
                    productId: 1,
                    userId: 1,
                    quantity: 1,
                    startDate: 1,
                    endDate: 1,
                    preRentalScreening: 1,
                    images: 1,
                    addressId: 1,
                    price: 1,
                    totalAmount: 1,
                    expandId: 1,
                    isAccepted: 1,
                    status: 1,
                    acceptedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isDeleted: 1,
                    userDetail: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        phone: 1,
                        address: 1,
                        profilePic: 1,
                    },
                    productDetail: {
                        title: 1,
                        description: 1,
                        images: 1,
                        address: 1,
                        location: 1,
                        quantity: 1,
                        price: 1,
                    }
                }
            }
        ]).sort({ createdAt: -1 });
        console.log("findBooking", findBooking)
        if (findBooking) {
            return FormateData(findBooking);
        } else {
            return FormateData({ message: "Booking not found" });
        }
    }
    //get all booking
    async getAllBooking(bookingInputs: bookingGetRequest) {
        let criteria: any = { isDeleted: false };
        if (bookingInputs._id) {
            criteria._id = bookingInputs._id;
        }
        if (bookingInputs.user.roleName === "user") {
            criteria.userId = bookingInputs.user._id;
        }
        if (bookingInputs.productId) {
            criteria.productId = bookingInputs.productId;
        }
        if (bookingInputs.startDate && bookingInputs.endDate) {
            criteria.$and = [
                { startDate: { $gte: bookingInputs.startDate } },
                { endDate: { $lte: bookingInputs.endDate } }
            ]
        }
        console.log("criteria", criteria)
        const findBooking = await bookingModel.find(criteria);
        console.log("findBooking", findBooking)
        if (findBooking) {
            return FormateData(findBooking);
        } else {
            return FormateData({ message: "Booking not found" });
        }

    }
    //add images to booking
    async addImagesToBooking(bookingInputs: bookingRequest) {
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { $push: { images: bookingInputs.images } },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        }
    }
    //remove images from booking
    async removeImagesFromBooking(bookingInputs: bookingRequest) {
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { $pull: { images: bookingInputs.images } },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        }
    }
    //update booking by id
    async updateBookingById(bookingInputs: bookingRequest) {
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { ...bookingInputs },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        }
    }
    // update preRentalScreening by booking id
    async updatePreRentalScreeningByBookingId(bookingInputs: bookingRequest) {
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { ...bookingInputs },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        } else {
            return FormateData({ message: "Booking not found" });
        }
    }
    //approve booking by product owner
    async approveBooking(bookingInputs: bookingUpdateRequest) {
        //check booking is exist or not
        let booking = await bookingModel.findOne(
            {
                _id: bookingInputs._id,
                isDeleted: false
            });
        if (!booking) {
            return FormateData({ message: "Booking not found" });
        }
        //check product owner 
        let product = await productModel.findOne(
            {
                _id: booking.productId,
                userId: bookingInputs.acceptedBy,
                isDeleted: false
            });
        if (!product) {
            return FormateData({ message: "unauthorized user for this product" });
        }
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { isAccepted: true, acceptedBy: bookingInputs.acceptedBy },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        }
    }
    // reject booking by product owner
    async rejectBooking(bookingInputs: bookingUpdateRequest, req: approveAuthenticatedRequest) {
        //check booking is exist or not
        let booking = await bookingModel.findOne(
            {
                _id: bookingInputs._id,
                isDeleted: false
            });
        if (!booking) {
            return FormateData({ message: "Booking not found" });
        }
        //check product owner 
        let product = await productModel.findOne(
            {
                _id: booking.productId,
                userId: bookingInputs.acceptedBy,
                isDeleted: false
            });
        if (!product) {
            return FormateData({ message: "unauthorized user for this product" });
        }
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { isAccepted: false, acceptedBy: bookingInputs.acceptedBy },
            { new: true });
        if (bookingResult) {
            let tempBody = {
                productId: bookingResult.productId,
                startDate: bookingResult.startDate.toISOString().split("T")[0],
                endDate: bookingResult.endDate.toISOString().split("T")[0],
            }
            await axios.post("http://localhost:5004/app/api/v1/product/update-relieveproductreservation", tempBody, {
                headers: {
                    Authorization: req.headers.token
                }
            })
            return FormateData(bookingResult);
        }
    }
    //delete booking by id
    async deleteBookingById(bookingInputs: { _id: string }) {
        const bookingResult = await bookingModel.findOneAndUpdate(
            { _id: bookingInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (bookingResult) {
            return FormateData(bookingResult);
        }
    }
}

export default BookingRepository;
