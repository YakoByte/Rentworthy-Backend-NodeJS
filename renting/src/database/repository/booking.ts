import { bookingModel, productModel, productReservationModel, profileModel } from "../models";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import {
  bookingRequest,
  bookingGetRequest,
  bookingUpdateRequest,
  postAuthenticatedRequest,
  recentBookingGetRequest,
  approveAuthenticatedRequest,
  bookingRequestWithPayment,
} from "../../interface/booking";
import { sendEmail } from "../../template/emailTemplate";
import { generatePresignedUrl } from "../../utils/aws";
import fetch from "node-fetch";

class BookingRepository {
  //create booking
  async CreateBookingPrevious(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
    let bookingResult;
    try {      
      //check product's date already booked or product is exist in booking
      let product: any = await productModel.findOneAndUpdate(
        {
          _id: bookingInputs.productId,
          quantity: { $gte: bookingInputs.quantity },
          $and: [
            { "rentingDate.startDate": { $lte: bookingInputs.startDate } },
            { "rentingDate.endDate": { $gte: bookingInputs.endDate } },
          ],
          isDeleted: false,
        },
        { $inc: { interactionCount: 1 } },
        { new: true }
      );
      
      if(!product){
        return { message: "Product not available in this Date" }
      }

      // call updateLevel api
      await fetch('https://backend.rentworthy.us/app/api/v1/user/update-level', {
        method: 'PUT',
        headers: {
            Authorization: req.headers.authorization,
            IDENTIFIER: 'A2hG9tE4rB6kY1sN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: product.userId })
      });
      
      //already booked
      let findSameBooking = await bookingModel.find({
        $and: [
          { startDate: { $gte: bookingInputs.startDate } },
          { endDate: { $lte: bookingInputs.endDate } },
          { productId: bookingInputs.productId },
        ],
      });
      if (findSameBooking && findSameBooking.length > 0) {
        return { message: "Product already booked" };
      }
      // check quantity is available or not
      let findAllBooking = await bookingModel.find({
        productId: bookingInputs.productId,
        isDeleted: false,
      });

      let totalQuantity = 0;
      findAllBooking.forEach((element: any) => {
        totalQuantity += element.quantity;
      });

      if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {        
        return { message: "All the Products Are Booked" };
      }

      let tempObj: bookingRequestWithPayment = { ...bookingInputs };
      const booking = new bookingModel(tempObj);
      bookingResult = await booking.save();

      if (bookingResult) {
        let tempBody = {
          productId: bookingInputs.productId,
          startDate: bookingInputs.startDate,
          endDate: bookingInputs.endDate,
        };
        await fetch("https://backend.rentworthy.us/app/api/v1/product/update-productreservation", {
          method: 'POST',
          headers: {
              Authorization: req.headers.authorization,
              IDENTIFIER: 'A2hG9tE4rB6kY1sN',
              "Content-Type": "application/json",
          },
          body: JSON.stringify(tempBody)
        });
      }

      console.log("Update product reservation");


      const findUser = await bookingModel.aggregate([
        { $match: { _id: new ObjectId(bookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
      ]);      

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: "Booking Initiated",
          templateVariables: { action: "Booking Initiated" },
        };

        sendEmail(emailOptions);
      }

      return bookingResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Booking");
    }
  }

  async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
    let bookingResult;
    try {      
      //check product's date already booked or product is exist in booking
      let product: any = await productModel.findOneAndUpdate(
        {
          _id: bookingInputs.productId,
          quantity: { $gte: bookingInputs.quantity },
          $and: [
            { "rentingDate.startDate": { $lte: bookingInputs.startDate } },
            { "rentingDate.endDate": { $gte: bookingInputs.endDate } },
          ],
          isDeleted: false,
        },
        { $inc: { interactionCount: 1 } },
        { new: true }
      );
      
      if(!product){
        return { message: "Product not available in this Date" }
      }


      // call updateLevel api
      const profile: any = await profileModel.findOneAndUpdate(
        {
          userId: product.userId,
          isDeleted: false,
          isBlocked: false,
        },
        { $inc: { points: 1 } },
        { new: true }
      );

      if (profile.points >= 3000 && profile.level < 2) {
        profile.level = 2;
      }
      if (profile.points >= 6000 && profile.level < 3) {
        profile.level = 3;
      }
      await profile.save();

      
      //already booked
      let findSameBooking = await bookingModel.find({
        $and: [
          { startDate: { $gte: bookingInputs.startDate } },
          { endDate: { $lte: bookingInputs.endDate } },
          { productId: bookingInputs.productId },
        ],
      });
      if (findSameBooking && findSameBooking.length > 0) {
        return { message: "Product already booked" };
      }
      // check quantity is available or not
      let findAllBooking = await bookingModel.find({
        productId: bookingInputs.productId,
        isDeleted: false,
      });

      let totalQuantity = 0;
      findAllBooking.forEach((element: any) => {
        totalQuantity += element.quantity;
      });

      if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {        
        return { message: "All the Products Are Booked" };
      }

      let tempObj: bookingRequestWithPayment = { ...bookingInputs };
      const booking = new bookingModel(tempObj);
      bookingResult = await booking.save();

      
      if (bookingResult) {
        let tempBody = {
          productId: bookingInputs.productId,
          startDate: bookingInputs.startDate,
          endDate: bookingInputs.endDate,
        };
        let tpStart = new Date(tempBody.startDate);
        let tpEnd = new Date(tempBody.endDate);
        let resp: any = [];
        while (tpStart <= tpEnd) {
          let tempObj = {
            productId: tempBody.productId,
            available: tpStart.getDate(),
            month: tpStart.getMonth() + 1,
            year: tpStart.getFullYear(),
          };
          resp.push(tempObj);
          tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
        }
        let temp: any = [];
        resp = resp.reduce((acc: any, one: any, i: any) => {
          if (
            resp[i + 1] &&
            resp[i + 1] &&
            resp[i + 1].month == one.month &&
            resp[i + 1].year == one.year
          ) {
            temp.push(one.available);
          } else {
            temp.push(one.available);
            acc.push({
              productId: one.productId,
              reserved: [...temp],
              month: one.month,
              year: one.year,
            });
            temp = [];
          }
          return acc;
        }, []);
        for (let oneObj of resp) {
          await productReservationModel.findOneAndUpdate(
            {
              productId: oneObj.productId,
              month: oneObj.month,
              year: oneObj.year,
            },
            {
              $push: {
                customerRes: oneObj.reserved,
              },
              $pull: {
                availableDates: {
                  $in: oneObj.reserved,
                },
              },
            }
          );
        }
      }

      console.log("Update product reservation");


      const findUser = await bookingModel.aggregate([
        { $match: { _id: new ObjectId(bookingResult._id), isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
      ]);      

      if (findUser[0].userId.email) {
        const emailOptions = {
          toUser: findUser[0].userId.email,
          subject: "Booking Initiated",
          templateVariables: { action: "Booking Initiated" },
        };

        sendEmail(emailOptions);
      }

      return bookingResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Booking");
    }
  }

  // get active booking, panding, completed, requested
  async getBooking(bookingInputs: bookingGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      if (bookingInputs.status == "active") {
        criteria.status = "pending";
      } else if (bookingInputs.status == "completed") {
        criteria.status = bookingInputs.status;
      } else if (bookingInputs.status == "requested") {
        criteria.status = "accepted";
      }

      // const findBooking = await bookingModel.find(criteria);
      const findBooking = await bookingModel.aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
            as: "userDetail",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "preRentalScreening.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "preRentalScreening.images",
          },
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
          },
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
            },
          },
        },
      ]);

      if (findBooking) {
        await Promise.all(
          findBooking.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findBooking;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Booking");
    }
  }

  // get recent booking
  async getRecentBooking(bookingInputs: recentBookingGetRequest) {
    try {
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
          { endDate: { $lte: bookingInputs.endDate } },
        ];
      }

      //add user detail and product detail in booking
      const findBooking = await bookingModel
        .aggregate([
          {
            $match: criteria,
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
              as: "userDetail",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $lookup: {
              from: "images",
              localField: "images",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "images",
            },
          },
          {
            $lookup: {
              from: "images",
              localField: "preRentalScreening.images",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "preRentalScreening.images",
            },
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
            },
          },
          {
            $project: {
              productId: 1,
              userId: 1,
              quantity: 1,
              startDate: 1,
              endDate: 1,
              preRentalScreening: 1,
              images: {
                _id: 1,
                image: 1,
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
              },
            },
          },
        ])
        .sort({ createdAt: -1 });

        if (findBooking) {
          await Promise.all(
            findBooking.map(async (booking: any) => {
              await Promise.all(
                booking.images.map(async (element: any) => {
                  const newPath = await generatePresignedUrl(element.imageName);
                  element.path = newPath;
                })
              );
            })
          );
        return findBooking;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get recent Booking");
    }
  }

  //get all booking
  async getAllBooking(bookingInputs: bookingGetRequest) {
    try {
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
          { endDate: { $lte: bookingInputs.endDate } },
        ];
      }
      if (bookingInputs.status) {
        if (bookingInputs.status == "activeRental") {
          criteria = {
            $and: [
              { status: "accepted" },
              { startDate: { $lte: new Date() } },
              { endDate: { $gte: new Date() } },
              { isDeleted: false },
            ],
          };
        } else if (bookingInputs.status == "requests") {
          criteria = {
            $and: [
              { status: "pending" },
              { isDeleted: false },
              { startDate: { $gte: new Date() } },
            ],
          };
        } else if (bookingInputs.status == "rented") {
          criteria = {
            $and: [
              { status: "completed" },
              { startDate: { $lte: new Date() } },
              { endDate: { $lte: new Date() } },
              { isDeleted: false },
            ],
          };
        } else if (bookingInputs.status == "requested") {
          criteria = {
            $and: [
              { status: "accepted" },
              { startDate: { $gte: new Date() } },
              { isDeleted: false },
            ],
          };
        }
      } 

      const findBooking = await bookingModel.aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }],
            as: "userDetail",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productId",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "preRentalScreening.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "preRentalScreening.images",
          },
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
          },
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
            },
          },
        },
      ]);

      findBooking.map(async (element) => {
        let profileData = await profileModel.aggregate([
          {
            $match: {
              userId: element.productId[0].userId
            },
          },
          {
            $lookup: {
              from: "images",
              localField: "profileImage",
              foreignField: "_id",
              pipeline: [
                { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
              ],
              as: "profileImage",
            },
          },
        ]);
        
        if(profileData.length > 0 && profileData[0].profileImage.length > 0 && profileData[0].profileImage[0].imageName) {
          element.productId[0].profileImage = await generatePresignedUrl(profileData[0].profileImage[0].imageName);
          element.productId[0].userName = profileData[0].userName
        }
      });


      if (findBooking) {
        await Promise.all(
          findBooking.map(async (booking: any) => {
            await Promise.all(
              booking.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
      return findBooking;
    }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get all Booking");
    }
  }

  //add images to booking
  async addImagesToBooking(bookingInputs: bookingRequest) {
    try {
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { $push: { images: bookingInputs.images } },
        { new: true }
      );
      if (bookingResult) {
        return bookingResult;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to add image Booking");
    }
  }
  
  //remove images from booking
  async removeImagesFromBooking(bookingInputs: bookingRequest) {
    try {
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { $pull: { images: bookingInputs.images } },
        { new: true }
      );
      if (bookingResult) {
        return bookingResult;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to remove Booking");
    }
  }

  //update booking by id
  async updateBookingById(bookingInputs: bookingRequest) {
    try {
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { ...bookingInputs },
        { new: true }
      );
      if (bookingResult) {
        return bookingResult;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update Booking");
    }
  }

  // update preRentalScreening by booking id
  async updatePreRentalScreeningByBookingId(bookingInputs: bookingRequest) {
    try {
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { ...bookingInputs },
        { new: true }
      );
      if (bookingResult) {
        return bookingResult;
      }
        return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update pre rental screening Booking");
    }
  }

  //approve booking by product owner
  async approveBooking(bookingInputs: bookingUpdateRequest) {
    try {
      //check booking is exist or not
      let booking = await bookingModel.findOne({
        _id: bookingInputs._id,
        isDeleted: false,
      });
      if (!booking) {
        return { message: "Booking not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: booking.productId,
        userId: bookingInputs.acceptedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { isAccepted: true, acceptedBy: bookingInputs.acceptedBy },
        { new: true }
      );
      if (bookingResult) {
        const findUser = await bookingModel.aggregate([
          {
            $match: { _id: new ObjectId(bookingResult._id), isDeleted: false },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
            },
          },
        ]);

        if (findUser[0].userId.email) {
          const emailOptions = {
            toUser: findUser[0].userId.email,
            subject: "Booking Approved",
            templateVariables: { action: "Booking Approved" },
          };

          sendEmail(emailOptions);
        }

        return bookingResult;
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to approve Booking");
    }
  }

  // reject booking by product owner
  async rejectBookingPrevious(bookingInputs: bookingUpdateRequest, req: approveAuthenticatedRequest) {
    try {
      //check booking is exist or not
      let booking = await bookingModel.findOne({
        _id: bookingInputs._id,
        isDeleted: false,
      });
      if (!booking) {
        return { message: "Booking not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: booking.productId,
        userId: bookingInputs.acceptedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { isAccepted: false, acceptedBy: bookingInputs.acceptedBy },
        { new: true }
      );

      if (bookingResult) {
        // Prepare data for updating product reservation status
      let tempBody = {
        productId: bookingResult.productId,
        startDate: bookingResult.startDate.toISOString().split("T")[0],
        endDate: bookingResult.endDate.toISOString().split("T")[0],
      };

      // Call external API to update product reservation status
      await fetch("https://backend.rentworthy.us/app/api/v1/product/update-relieveproductreservation", {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization,
          IDENTIFIER: 'A2hG9tE4rB6kY1sN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempBody)
      });

        const findUser = await bookingModel.aggregate([
          {
            $match: { _id: new ObjectId(bookingResult._id), isDeleted: false },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
            },
          },
        ]);

        if (findUser[0].userId.email) {
          const emailOptions = {
            toUser: findUser[0].userId.email,
            subject: "Booking Rejected",
            templateVariables: { action: "Booking Rejected" },
          };

          sendEmail(emailOptions);
        }

        return bookingResult;
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to reject Booking");
    }
  }

  async rejectBooking(bookingInputs: bookingUpdateRequest, req: approveAuthenticatedRequest) {
    try {
      //check booking is exist or not
      let booking = await bookingModel.findOne({
        _id: bookingInputs._id,
        isDeleted: false,
      });
      if (!booking) {
        return { message: "Booking not found" };
      }
      //check product owner
      let product = await productModel.findOne({
        _id: booking.productId,
        userId: bookingInputs.acceptedBy,
        isDeleted: false,
      });
      if (!product) {
        return { message: "unauthorized user for this product" };
      }
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { isAccepted: false, acceptedBy: bookingInputs.acceptedBy },
        { new: true }
      );

      if (bookingResult) {
        // Prepare data for updating product reservation status
      let tempBody = {
        productId: bookingResult.productId,
        startDate: bookingResult.startDate.toISOString().split("T")[0],
        endDate: bookingResult.endDate.toISOString().split("T")[0],
      };

      // Call external API to update product reservation status
      let tpStart = new Date(tempBody.startDate);
      let tpEnd = new Date(tempBody.endDate);
      let resp: any = [];
        while (tpStart <= tpEnd) {
          let tempObj = {
            productId: tempBody.productId,
            available: tpStart.getDate(),
            month: tpStart.getMonth() + 1,
            year: tpStart.getFullYear(),
          };
          resp.push(tempObj);
          tpStart = new Date(tpStart.setDate(tpStart.getDate() + 1));
        }
        let temp: any = [];
        resp = resp.reduce((acc: any, one: any, i: any) => {
          if (
            resp[i + 1] &&
            resp[i + 1] &&
            resp[i + 1].month == one.month &&
            resp[i + 1].year == one.year
          ) {
            temp.push(one.available);
          } else {
            temp.push(one.available);
            acc.push({
              productId: one.productId,
              reserved: [...temp],
              month: one.month,
              year: one.year,
            });
            temp = [];
          }
          return acc;
        }, []);
        for (let oneObj of resp) {
          await productReservationModel.findOneAndUpdate(
            {
              productId: oneObj.productId,
              month: oneObj.month,
              year: oneObj.year,
            },
            {
              $push: {
                availableDates: oneObj.reserved,
              },
              $pull: {
                customerRes: {
                  $in: oneObj.reserved,
                },
              },
            }
          );
        }
  
        const findUser = await bookingModel.aggregate([
          {
            $match: { _id: new ObjectId(bookingResult._id), isDeleted: false },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
            },
          },
        ]);

        if (findUser[0].userId.email) {
          const emailOptions = {
            toUser: findUser[0].userId.email,
            subject: "Booking Rejected",
            templateVariables: { action: "Booking Rejected" },
          };

          sendEmail(emailOptions);
        }

        return bookingResult;
      }
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to reject Booking");
    }
  }

  //delete booking by id
  async deleteBookingById(bookingInputs: { _id: string }) {
    try {
      const bookingResult = await bookingModel.findOneAndUpdate(
        { _id: bookingInputs._id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (bookingResult) {
        return bookingResult;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to delete Booking");
    }
  }

  async dummyAPI() {
    try {
      const response = await fetch("https://backend.rentworthy.us/app/api/v1/product/guest-product", {
        method: 'GET',
        headers: {
          IDENTIFIER: 'A2hG9tE4rB6kY1sN',
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to delete Booking");
    }
  }
}

export default BookingRepository;
