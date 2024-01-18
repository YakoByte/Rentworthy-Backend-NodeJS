import { bookingModel, productModel, historyModel } from "../models";
import axios from 'axios';

import { Types } from 'mongoose';
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
import booking from "../../api/booking";
class BookingRepository {
    //create booking
    async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
        let bookingResult
        try {
            //check product's date already booked or product is exist in booking
            let product: any = await productModel.findOneAndUpdate(
                {
                    _id: bookingInputs.productId,
                    quantity: { $gte: bookingInputs.quantity },
                    $and: [
                        { "rentingDate.startDate": { $lte: bookingInputs.startDate } },
                        { "rentingDate.endDate": { $gte: bookingInputs.endDate } }
                    ],
                    isDeleted: false
                }, { $inc: { interactionCount: 1 } }, { new: true });
            console.log("product", product)

            // call updateLevel api 
            let updateProfile = await axios.put("http://localhost:5000/app/api/v1/user/update-level", {
                userId: product.userId
            })
            console.log("updateProfile", updateProfile)

            if (!product) {
                return FormateData({ message: "Product not available in this Date" });
            }

            //already booked
            let findSameBooking = await bookingModel.find(
                {
                    $and: [
                        { startDate: { $gte: bookingInputs.startDate } },
                        { endDate: { $lte: bookingInputs.endDate } },
                        { productId: bookingInputs.productId }]
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
        // const findBooking = await bookingModel.find(criteria);
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
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images"
                }
            },
            {
                $unwind: "$userDetail"
            },
            {
                $unwind: "$productDetail"
            },
            {
                $unwind: "$preRentalScreening"
            },
            {
                $lookup: {
                    from: "images",
                    localField: "preRentalScreening.images",
                    foreignField: "_id",
                    as: "preRentalScreening.images"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    productId: { $first: "$productId" },
                    userId: { $first: "$userId" },
                    quantity: { $first: "$quantity" },
                    startDate: { $first: "$startDate" },
                    endDate: { $first: "$endDate" },
                    images: { $first: "$images" },
                    preRentalScreening: { $push: "$preRentalScreening" },
                    addressId: { $first: "$addressId" },
                    price: { $first: "$price" },
                    totalAmount: { $first: "$totalAmount" },
                    expandId: { $first: "$expandId" },
                    isAccepted: { $first: "$isAccepted" },
                    status: { $first: "$status" },
                    acceptedBy: { $first: "$acceptedBy" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    isDeleted: { $first: "$isDeleted" },
                    userDetail: { $first: "$userDetail" },
                    productDetail: { $first: "$productDetail" },
                }
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
                        name: 1,
                    }
                }
            }
        ])
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
            criteria._id = new Types.ObjectId(bookingInputs._id);
        }
        if (bookingInputs.productId) {
            criteria.productId = new Types.ObjectId(bookingInputs.productId);
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
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images"
                }
            },
            {
                $unwind: "$userDetail"
            },
            {
                $unwind: "$productDetail"
            },
            {
                $unwind: "$preRentalScreening"
            },
            {
                $lookup: {
                    from: "images",
                    localField: "preRentalScreening.images",
                    foreignField: "_id",
                    as: "preRentalScreening.images"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    productId: { $first: "$productId" },
                    userId: { $first: "$userId" },
                    quantity: { $first: "$quantity" },
                    startDate: { $first: "$startDate" },
                    endDate: { $first: "$endDate" },
                    images: { $first: "$images" },
                    preRentalScreening: { $push: "$preRentalScreening" },
                    addressId: { $first: "$addressId" },
                    price: { $first: "$price" },
                    totalAmount: { $first: "$totalAmount" },
                    expandId: { $first: "$expandId" },
                    isAccepted: { $first: "$isAccepted" },
                    status: { $first: "$status" },
                    acceptedBy: { $first: "$acceptedBy" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    isDeleted: { $first: "$isDeleted" },
                    userDetail: { $first: "$userDetail" },
                    productDetail: { $first: "$productDetail" },
                }
            },
            {
                $project: {
                    productId: 1,
                    userId: 1,
                    quantity: 1,
                    startDate: 1,
                    endDate: 1,
                    preRentalScreening: 1,
                    images:
                    {
                        _id: 1,
                        image: 1
                    },
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
                        name: 1,
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
            criteria._id = new Types.ObjectId(bookingInputs._id);
        }
        if (bookingInputs.user.roleName === "user") {
            criteria.userId = new Types.ObjectId(bookingInputs.user._id);
        }
        if (bookingInputs.productId) {
            criteria.productId = new Types.ObjectId(bookingInputs.productId);
        }
        if (bookingInputs.startDate && bookingInputs.endDate) {
            criteria.$and = [
                { startDate: { $gte: bookingInputs.startDate } },
                { endDate: { $lte: bookingInputs.endDate } }
            ]
        }
        if (bookingInputs.status) {
            if (bookingInputs.status == "activeRental") {
                criteria = {
                    $and: [
                        // { status: "accepted" },
                        { startDate: { $lte: new Date() } },
                        { endDate: { $gte: new Date() } },
                        { isDeleted: false }
                    ]
                }
            }
            else if (bookingInputs.status == "requests") {
                criteria = {
                    $and: [
                        { status: "pending" },
                        { isDeleted: false },
                        { startDate: { $gte: new Date() } },
                    ]
                }
            }
            else if (bookingInputs.status == "rented") {
                criteria = {
                    $and: [
                        { status: "completed" },
                        { startDate: { $lte: new Date() } },
                        { endDate: { $lte: new Date() } },
                        { isDeleted: false }
                    ]
                }
            }
            else if (bookingInputs.status == "requested") {
                criteria = {
                    $and: [
                        { status: "accepted" },
                        { startDate: { $gte: new Date() } },
                        { isDeleted: false }
                    ]
                }
            }
        }
        console.log("criteria", criteria)
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
            // {
            //     $unwind: "$images"
            // },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images"
                }
            },
            {
                $unwind: "$preRentalScreening"
            },
            {
                $lookup: {
                    from: "images",
                    localField: "preRentalScreening.images",
                    foreignField: "_id",
                    as: "preRentalScreening.images"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    productId: { $first: "$productId" },
                    userId: { $first: "$userId" },
                    quantity: { $first: "$quantity" },
                    startDate: { $first: "$startDate" },
                    endDate: { $first: "$endDate" },
                    images: { $first: "$images" },
                    // images: {
                    //     $push: {
                    //         _id: "$images._id",
                    //         image: "$images.image"
                    //     }
                    // },z
                    preRentalScreening: { $push: "$preRentalScreening" },
                    addressId: { $first: "$addressId" },
                    price: { $first: "$price" },
                    totalAmount: { $first: "$totalAmount" },
                    expandId: { $first: "$expandId" },
                    isAccepted: { $first: "$isAccepted" },
                    status: { $first: "$status" },
                    acceptedBy: { $first: "$acceptedBy" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    isDeleted: { $first: "$isDeleted" },
                    userDetail: { $first: "$userDetail" },
                    productDetail: { $first: "$productDetail" },
                }
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
                        userName: 1,
                        lastName: 1,
                        email: 1,
                        phone: 1,
                        bussinessType: 1,
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
                        name: 1,
                    }
                }
            }
        ])
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
