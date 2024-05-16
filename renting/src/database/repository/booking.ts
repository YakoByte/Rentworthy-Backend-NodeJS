import { bookingModel, productModel, profileModel, PaymentModel, AddressModel } from "../models";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import {
  bookingRequest,
  bookingGetRequest,
  bookingUpdateRequest,
  postAuthenticatedRequest,
  approveAuthenticatedRequest,
  expendDate,
} from "../../interface/booking";
import { sendEmail } from "../../template/emailTemplate";
import { generatePresignedUrl } from "../../utils/aws";

class BookingRepository {
  async CreateBooking(bookingInputs: bookingRequest, req: postAuthenticatedRequest) {
    let bookingResult;
    try {      
      //check product's date already booked or product is exist in booking
      let product: any = await productModel.findOneAndUpdate(
        {
          _id: bookingInputs.productId,
          quantity: { $gte: bookingInputs.quantity },
          isDeleted: false,
        },
        { $inc: { numberOfBooking: 1 } },
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

      if (profile?.points >= 3000 && profile?.level < 2) {
        profile.level = 2;
      }
      if (profile?.points >= 6000 && profile?.level < 3) {
        profile.level = 3;
      }
      await profile?.save();
      
      // Map over the BookingDate array to create an array of Promises
      const bookingPromises = bookingInputs?.BookingDate.map(async (date: any) => {        
        // Find bookings that match the given date and productId
        const findSameBooking = await bookingModel.find({
          BookingDate: { $elemMatch: { date: new Date(date) } },
          productId: bookingInputs.productId,
        }); 

        let totalQuantity = 0;
        findSameBooking.forEach((element: any) => {
          totalQuantity += element.quantity;
        });

        if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {        
          return { message: "All the Products Are Booked for entered Date" };
        }
  
        // If a booking is found, return a message indicating the product is already booked
        if (findSameBooking && findSameBooking.length > 0) {
          return { message: `Product already booked on ${date}` };
        }
  
        // Return null if no booking is found for the given date
        return null;
      });
  
      // Wait for all booking promises to resolve
      const bookingResults = await Promise.all(bookingPromises);      
  
      // Check if any of the booking promises returned a booked message
      const bookedMessage = bookingResults.find(result => result !== null);
      if (bookedMessage) {
        return bookedMessage;
      }
      
      const dates = bookingInputs?.BookingDate.map((element: any) => {
        return { date: new Date(element) };
      }); 
         
      let tempObj = { ...bookingInputs, BookingDate: dates }      
      const booking = new bookingModel(tempObj);
      bookingResult = await booking.save();

      if(bookingInputs.status) {
        await bookingModel.findByIdAndUpdate(
          bookingResult._id, 
          { $push: { statusHistory: bookingInputs.status } }, 
          { new: true }
        );
      }

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

  async CreateExpandDate(bookingInputs: expendDate) {
    let expandDateResult;
    try {
      // Check if product exists and has enough quantity available
      const booking = await bookingModel.findOne({
        _id: bookingInputs._id,
        isDeleted: false,
      });
  
      if (!booking) {
        return { message: "Booking not Found with given id" };
      }

      // Check if product exists and has enough quantity available
      const product = await productModel.findOne({
        _id: bookingInputs.productId,
        quantity: { $gte: bookingInputs.quantity },
        isDeleted: false,
      });
  
      if (!product) {
        return { message: "Product not available in this Date" };
      }
  
      // Map over the BookingDate array to create an array of Promises
      const bookingPromises = bookingInputs?.BookingDate.map(async (date: any) => {
        // Find bookings that match the given date and productId
        const findSameBooking = await bookingModel.find({
          BookingDate: { $elemMatch: { date: new Date(date) } },
          productId: bookingInputs.productId,
        });

        let totalQuantity = 0;
        findSameBooking.forEach((element: any) => {
          totalQuantity += element.quantity;
        });

        if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {        
          return { message: "All the Products Are Booked for entered Date" };
        }
  
        // If a booking is found, return a message indicating the product is already booked
        if (findSameBooking && findSameBooking.length > 0) {
          return { message: `Product already booked on ${date}` };
        }
  
        // Return null if no booking is found for the given date
        return null;
      });
  
      // Wait for all booking promises to resolve
      const bookingResults = await Promise.all(bookingPromises);
  
      // Check if any of the booking promises returned a booked message
      const bookedMessage = bookingResults.find(result => result !== null);
      if (bookedMessage) {
        return bookedMessage;
      }
  
      // Check quantity available in existing bookings
      const findAllBooking = await bookingModel.find({
        productId: bookingInputs.productId,
        isDeleted: false,
      });
  
      // Calculate total quantity booked
      let totalQuantity = 0;
      findAllBooking.forEach((element: any) => {
        totalQuantity += element.quantity;
      });
  
      if (totalQuantity + Number(bookingInputs.quantity) > Number(product.quantity)) {
        return { message: "All the Products Are Booked" };
      }
      
      let dates: any[] = bookingInputs?.BookingDate.map(element => {
        return { date: new Date(element) };
      });

      booking.BookingDate.forEach(element => {
        dates.push(element)
      });

      const price = booking.price + (Number(bookingInputs?.price) || 0);
      let tempObj = { ...bookingInputs, BookingDate: dates, price: price };
      expandDateResult = await bookingModel.updateOne({_id: booking._id}, tempObj, {new: true});

      return expandDateResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Expand Date");
    }
  }

  // get booking, Requested, Confirmed, Rejected, Shipped, Delivered, Returned, Cancelled
  async getBooking(bookingInputs: bookingGetRequest) {
    try {
      let criteria: any = { isDeleted: false, status: bookingInputs.status };

      const findBooking = await bookingModel.aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "rentalUserDetail",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "paymentId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, amount: 1, userId: 1, paymentId: 1, status: 1 } }],
            as: "paymentId",
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
        { $unwind: {
          path: "$productId",
          preserveNullAndEmptyArrays: true
        }},
        { $unwind: {
          path: "$paymentId",
          preserveNullAndEmptyArrays: true
        }},
        {
          $lookup: {
            from: "images",
            localField: "productId.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productId.images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "productId.userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "OwnerUserDetail",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "addressId",
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
        { $unwind: {
          path: "$preRentalScreening",
          preserveNullAndEmptyArrays: true
        }},     
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
            productId: { $push: "$productId" },
            BookingDate: { $first: "$BookingDate" },
            userId: { $first: "$userId" },
            paymentId: { $push: "$paymentId" },
            quantity: { $first: "$quantity" },
            isDeleted: { $first: "$isDeleted" },
            expandId: { $first: "$expandId" },
            isAccepted: { $first: "$isAccepted" },
            images: { $first: "$images" },
            addressId: { $first: "$addressId" },
            price: { $first: "$price" },
            totalAmount: { $first: "$totalAmount" },
            status: { $first: "$status" },
            acceptedBy: { $first: "$acceptedBy" },
            preRentalScreening: { $push: "$preRentalScreening" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            rentalUserDetail: { $first: "$rentalUserDetail" },
            OwnerUserDetail: { $first: "$OwnerUserDetail" },
          },
        },
        {
          $project: {
            _id: 1,
            productId: 1,
            BookingDate: 1,
            userId: 1,
            paymentId: 1,
            quantity: 1,
            isDeleted: 1,
            expandId: 1,
            isAccepted: 1,
            images: 1,
            addressId: 1,
            price: 1,
            totalAmount: 1,
            status: 1,
            acceptedBy: 1,
            preRentalScreening: 1,
            createdAt: 1,
            updatedAt: 1,
            rentalUserDetail: 1,
            OwnerUserDetail: 1
          },
        },
      ]);      
  
      await Promise.all(findBooking.map(async (element) => {
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
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.OwnerUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        }
        else {
          element.OwnerUserDetail[0].profileImage = '';
        }
        element.OwnerUserDetail[0].userName = profileData[0]?.userName || '';
      }));

      await Promise.all(findBooking.map(async (element) => {
        let profileData = await profileModel.aggregate([
          {
            $match: {
              userId: element.userId
            },
          },
          {
            $lookup: {
                from: "images",
                localField: "profileImage",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
                as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.rentalUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        } else {
          element.rentalUserDetail[0].profileImage = '';
        }
        element.rentalUserDetail[0].userName = profileData[0]?.userName || '';
      }));
  
      await Promise.all(findBooking.map(async (booking) => {
        await Promise.all(booking.images.map(async (element: { imageName: string; path: string; }) => {
          const newPath = await generatePresignedUrl(element.imageName);
          element.path = newPath;
        }));
      }));

      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.productId.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));
      
      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.preRentalScreening.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));

      return findBooking;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Booking");
    }
  }

  // get recent booking
  async getRecentBooking(bookingInputs: bookingGetRequest) {
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
      if (bookingInputs.BookingDate) {
        criteria.BookingDate = { $elemMatch: bookingInputs.BookingDate };
      }
      if (bookingInputs.status) {
          if (bookingInputs.status == "Confirmed") {
            criteria = {
              $and: [
                { status: "Confirmed" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Requested") {
            criteria = {
              $and: [
                { status: "Requested" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Returned") {
            criteria = {
              $and: [
                { status: "Returned" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Rejected") {
            criteria = {
              $and: [
                { status: "Rejected" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Shipped") {
            criteria = {
              $and: [
                { status: "Shipped" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Delivered") {
            criteria = {
              $and: [
                { status: "Delivered" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Canceled") {
            criteria = {
              $and: [
                { status: "Canceled" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          }
      }

      //add user detail and product detail in booking
      const findBooking = await bookingModel.aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "rentalUserDetail",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "paymentId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, amount: 1, userId: 1, paymentId: 1, status: 1 } }],
            as: "paymentId",
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
        { $unwind: {
          path: "$productId",
          preserveNullAndEmptyArrays: true
        }},
        { $unwind: {
          path: "$paymentId",
          preserveNullAndEmptyArrays: true
        }},
        {
          $lookup: {
            from: "images",
            localField: "productId.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productId.images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "productId.userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "OwnerUserDetail",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "addressId",
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
        { $unwind: {
          path: "$preRentalScreening",
          preserveNullAndEmptyArrays: true
        }},      
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
            productId: { $push: "$productId" },
            BookingDate: { $first: "$BookingDate" },
            userId: { $first: "$userId" },
            paymentId: { $push: "$paymentId" },
            quantity: { $first: "$quantity" },
            isDeleted: { $first: "$isDeleted" },
            expandId: { $first: "$expandId" },
            isAccepted: { $first: "$isAccepted" },
            images: { $first: "$images" },
            addressId: { $first: "$addressId" },
            price: { $first: "$price" },
            totalAmount: { $first: "$totalAmount" },
            status: { $first: "$status" },
            acceptedBy: { $first: "$acceptedBy" },
            preRentalScreening: { $push: "$preRentalScreening" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            rentalUserDetail: { $first: "$rentalUserDetail" },
            OwnerUserDetail: { $first: "$OwnerUserDetail" },
          },
        },
        {
          $project: {
            _id: 1,
            productId: 1,
            BookingDate: 1,
            userId: 1,
            paymentId: 1,
            quantity: 1,
            isDeleted: 1,
            expandId: 1,
            isAccepted: 1,
            images: 1,
            addressId: 1,
            price: 1,
            totalAmount: 1,
            status: 1,
            acceptedBy: 1,
            preRentalScreening: 1,
            createdAt: 1,
            updatedAt: 1,
            rentalUserDetail: 1,
            OwnerUserDetail: 1
          },
        },
      ]).sort({ createdAt: -1 });


      await Promise.all(findBooking.map(async (element) => {
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
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.OwnerUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        }
        else {
          element.OwnerUserDetail[0].profileImage = '';
        }
        element.OwnerUserDetail[0].userName = profileData[0]?.userName || '';
      }));

      await Promise.all(findBooking.map(async (element) => {
        let profileData = await profileModel.aggregate([
          {
            $match: {
              userId: element.userId
            },
          },
          {
            $lookup: {
                from: "images",
                localField: "profileImage",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
                as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.rentalUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        } else {
          element.rentalUserDetail[0].profileImage = '';
        }
        element.rentalUserDetail[0].userName = profileData[0]?.userName || '';
      }));
  
      await Promise.all(findBooking.map(async (booking) => {
        await Promise.all(booking.images.map(async (element: { imageName: string; path: string; }) => {
          const newPath = await generatePresignedUrl(element.imageName);
          element.path = newPath;
        }));
      }));

      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.productId.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));
      
      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.preRentalScreening.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));

      return findBooking;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get recent Booking");
    }
  }

  // get booking, Requested, Confirmed, Rejected, Shipped, Delivered, Returned, Cancelled
  async getUsersProductBooking(bookingInputs: bookingGetRequest) {
    try {
      const productCriteria: any = { isVerified: "approved", isDeleted: false, isActive: true };
      if(bookingInputs.userId) {
        productCriteria.userId = new Types.ObjectId(bookingInputs.userId)
      }
      if (bookingInputs.user.roleName === "user") {
        productCriteria.userId = new Types.ObjectId(bookingInputs.user._id);
      }
      if(bookingInputs.productId) {
        productCriteria._id = new Types.ObjectId(bookingInputs.productId)
      }
      const findProduct: any = await productModel.aggregate([
        {
            $match: productCriteria
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, businessType: 1, loginType: 1 } },
                ],
                as: "userId",
            },
        },
      ]);      

      if (findProduct.length === 0) {
        return { message: "Product not found" };
      }

      await Promise.all(findProduct.map(async (element: any) => {
        let criteria: any = {isDeleted: false, productId: element._id}
        if (bookingInputs.status) {
          criteria.status = bookingInputs.status;
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
              pipeline: [
                { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
              ],
              as: "rentalUserDetail",
            },
          },
          {
            $lookup: {
              from: "payments",
              localField: "paymentId",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, amount: 1, userId: 1, paymentId: 1, status: 1 } }],
              as: "paymentId",
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
          { $unwind: {
            path: "$productId",
            preserveNullAndEmptyArrays: true
          }},
          { $unwind: {
            path: "$paymentId",
            preserveNullAndEmptyArrays: true
          }},
          {
            $lookup: {
              from: "images",
              localField: "productId.images",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "productId.images",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "productId.userId",
              foreignField: "_id",
              pipeline: [
                { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
              ],
              as: "OwnerUserDetail",
            },
          },
          {
            $lookup: {
              from: "addresses",
              localField: "addressId",
              foreignField: "_id",
              as: "addressId",
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
          { $unwind: {
            path: "$preRentalScreening",
            preserveNullAndEmptyArrays: true
          }},     
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
              productId: { $push: "$productId" },
              BookingDate: { $first: "$BookingDate" },
              userId: { $first: "$userId" },
              paymentId: { $push: "$paymentId" },
              quantity: { $first: "$quantity" },
              isDeleted: { $first: "$isDeleted" },
              expandId: { $first: "$expandId" },
              isAccepted: { $first: "$isAccepted" },
              images: { $first: "$images" },
              addressId: { $first: "$addressId" },
              price: { $first: "$price" },
              totalAmount: { $first: "$totalAmount" },
              status: { $first: "$status" },
              acceptedBy: { $first: "$acceptedBy" },
              preRentalScreening: { $push: "$preRentalScreening" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              rentalUserDetail: { $first: "$rentalUserDetail" },
              OwnerUserDetail: { $first: "$OwnerUserDetail" },
            },
          },
          {
            $project: {
              _id: 1,
              productId: 1,
              BookingDate: 1,
              userId: 1,
              paymentId: 1,
              quantity: 1,
              isDeleted: 1,
              expandId: 1,
              isAccepted: 1,
              images: 1,
              addressId: 1,
              price: 1,
              totalAmount: 1,
              status: 1,
              acceptedBy: 1,
              preRentalScreening: 1,
              createdAt: 1,
              updatedAt: 1,
              rentalUserDetail: 1,
              OwnerUserDetail: 1
            },
          },
        ]);      
    
        await Promise.all(findBooking.map(async (element) => {
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
                pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
                as: "profileImage",
              },
            },
          ]);        
    
          if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
            element.OwnerUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
          }
          else {
            element.OwnerUserDetail[0].profileImage = '';
          }
          element.OwnerUserDetail[0].userName = profileData[0]?.userName || '';
        }));
  
        await Promise.all(findBooking.map(async (element) => {
          let profileData = await profileModel.aggregate([
            {
              $match: {
                userId: element.userId
              },
            },
            {
              $lookup: {
                  from: "images",
                  localField: "profileImage",
                  foreignField: "_id",
                  pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
                  as: "profileImage",
              },
            },
          ]);        
    
          if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
            element.rentalUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
          } else {
            element.rentalUserDetail[0].profileImage = '';
          }
          element.rentalUserDetail[0].userName = profileData[0]?.userName || '';
        }));
    
        await Promise.all(findBooking.map(async (booking) => {
          await Promise.all(booking.images.map(async (element: { imageName: string; path: string; }) => {
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
  
        await Promise.all(findBooking.map(async (booking) => {        
          await Promise.all(booking?.productId.map(async (screening: any) => {
            await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }));
        }));
        
        await Promise.all(findBooking.map(async (booking) => {        
          await Promise.all(booking?.preRentalScreening.map(async (screening: any) => {
            await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            }));
          }));
        }));
      
        element.bookings = findBooking;
      }));

      return findProduct;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Booking");
    }
  }

  //get all booking
  async getAllBooking(bookingInputs: bookingGetRequest) {
    try {      
      let criteria: any = { isDeleted: false };
      if (bookingInputs._id) {
        criteria._id = new Types.ObjectId(bookingInputs._id);
      }
      if(bookingInputs.userId) {
        criteria.userId = new Types.ObjectId(bookingInputs.userId);
      }
      if (bookingInputs.user.roleName === "user") {
        criteria.userId = new Types.ObjectId(bookingInputs.user._id);
      }
      if (bookingInputs.productId) {
        criteria.productId = new Types.ObjectId(bookingInputs.productId);
      }
      if (bookingInputs.BookingDate) {
        criteria.BookingDate = { $elemMatch: bookingInputs.BookingDate };
      }
      if (bookingInputs.status) {
          if (bookingInputs.status == "Confirmed") {
            criteria = {
              $and: [
                { status: "Confirmed" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Requested") {
            criteria = {
              $and: [
                { status: "Requested" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Returned") {
            criteria = {
              $and: [
                { status: "Returned" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Rejected") {
            criteria = {
              $and: [
                { status: "Rejected" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Shipped") {
            criteria = {
              $and: [
                { status: "Shipped" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Delivered") {
            criteria = {
              $and: [
                { status: "Delivered" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
                { isDeleted: false },
              ],
            };
          } else if (bookingInputs.status == "Canceled") {
            criteria = {
              $and: [
                { status: "Canceled" },
                { BookingDate: { $elemMatch: { $gte: new Date() }} },
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
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "rentalUserDetail",
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
            from: "payments",
            localField: "paymentId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, amount: 1, userId: 1, paymentId: 1, status: 1 } }],
            as: "paymentId",
          },
        },
        { $unwind: {
          path: "$productId",
          preserveNullAndEmptyArrays: true
        }},
        { $unwind: {
          path: "$paymentId",
          preserveNullAndEmptyArrays: true
        }},
        {
          $lookup: {
            from: "images",
            localField: "productId.images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "productId.images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "productId.userId",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } }
            ],
            as: "OwnerUserDetail",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "addressId",
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
        { $unwind: {
          path: "$preRentalScreening",
          preserveNullAndEmptyArrays: true
        }},      
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
            productId: { $push: "$productId" },
            BookingDate: { $first: "$BookingDate" },
            userId: { $first: "$userId" },
            paymentId: { $push: "$paymentId" },
            quantity: { $first: "$quantity" },
            isDeleted: { $first: "$isDeleted" },
            expandId: { $first: "$expandId" },
            isAccepted: { $first: "$isAccepted" },
            images: { $first: "$images" },
            addressId: { $first: "$addressId" },
            price: { $first: "$price" },
            totalAmount: { $first: "$totalAmount" },
            status: { $first: "$status" },
            acceptedBy: { $first: "$acceptedBy" },
            preRentalScreening: { $push: "$preRentalScreening" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            rentalUserDetail: { $first: "$rentalUserDetail" },
            OwnerUserDetail: { $first: "$OwnerUserDetail" },
          },
        },
        {
          $project: {
            _id: 1,
            productId: 1,
            BookingDate: 1,
            userId: 1,
            paymentId: 1,
            quantity: 1,
            isDeleted: 1,
            expandId: 1,
            isAccepted: 1,
            images: 1,
            addressId: 1,
            price: 1,
            totalAmount: 1,
            status: 1,
            acceptedBy: 1,
            preRentalScreening: 1,
            createdAt: 1,
            updatedAt: 1,
            rentalUserDetail: 1,
            OwnerUserDetail: 1
          },
        },
      ]);         
  
      await Promise.all(findBooking.map(async (element) => {
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
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
              as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.OwnerUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        }
        else {
          element.OwnerUserDetail[0].profileImage = '';
        }
        element.OwnerUserDetail[0].userName = profileData[0]?.userName || '';
      }));

      await Promise.all(findBooking.map(async (element) => {
        let profileData = await profileModel.aggregate([
          {
            $match: {
              userId: element.userId
            },
          },
          {
            $lookup: {
                from: "images",
                localField: "profileImage",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
                as: "profileImage",
            },
          },
        ]);        
  
        if (profileData?.length > 0 && profileData[0]?.profileImage?.length > 0 && profileData[0]?.profileImage[0]?.imageName) {          
          element.rentalUserDetail[0].profileImage = await generatePresignedUrl(profileData[0]?.profileImage[0]?.imageName) || '';
        } else {
          element.rentalUserDetail[0].profileImage = '';
        }
        element.rentalUserDetail[0].userName = profileData[0]?.userName || '';
      }));
  
      await Promise.all(findBooking.map(async (booking) => {
        await Promise.all(booking.images.map(async (element: { imageName: string; path: string; }) => {
          const newPath = await generatePresignedUrl(element.imageName);
          element.path = newPath;
        }));
      }));

      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.productId.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));
      
      await Promise.all(findBooking.map(async (booking) => {        
        await Promise.all(booking?.preRentalScreening.map(async (screening: any) => {
          await Promise.all(screening?.images.map(async (element: { imageName: string; path: string; }) => {          
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          }));
        }));
      }));

      const countBooking = await bookingModel.countDocuments(criteria);
  
      return {findBooking, countBooking};
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
        if(bookingInputs.status) {
          await bookingModel.findByIdAndUpdate(
            bookingResult._id, 
            { $push: { statusHistory: bookingInputs.status } }, 
            { new: true }
          );
        }

        return bookingResult;
      }
      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to update Booking");
    }
  }

  //update booking by id
  async updateBookingReview(bookingInputs: bookingUpdateRequest) {
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
        if(bookingInputs.status) {
          await bookingModel.findByIdAndUpdate(
            bookingResult._id, 
            { $push: { statusHistory: bookingInputs.status } }, 
            { new: true }
          );
        } 

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
        { 
          isAccepted: true, 
          acceptedBy: bookingInputs.acceptedBy, 
          status: "Confirmed", 
          $push: { statusHistory: "Confirmed" } 
        },
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
        { 
          isAccepted: false, 
          acceptedBy: bookingInputs.acceptedBy, 
          status: "Rejected", 
          $push: { statusHistory: "Rejected" } 
        },
        { new: true }
      );
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
        { isDeleted: true, status:  "Cancelled", $push: { statusHistory: "Cancelled" }},
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

  //track booking by id
  async trackBookingById(bookingInputs: { _id: string }) {
    try {
      const bookingResult = await bookingModel.findOne({ _id: bookingInputs._id });

      if (bookingResult) {
        const payment = await PaymentModel.findById(bookingResult?.paymentId);
        const address = await AddressModel.findById(bookingResult?.addressId);
        const product: any = await productModel.aggregate([
          {
            $match: {
              _id: new Types.ObjectId(bookingResult?.productId),
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
              from: "users",
              localField: "userId",
              foreignField: "_id",
              pipeline: [
                { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
              ],
              as: "userId",
            },
          },
        ]);
        
        if(product[0]?.images && product[0]?.images?.length > 0) {
          product[0].images.forEach(async(element: any) => {
            let newPath = await generatePresignedUrl(element?.imageName);
            element.path = newPath;
          });
        }         

        const data =  {
            _id: bookingResult?._id || "",
            productId: bookingResult?.productId || "",
            productName: product[0]?.name || "",
            productImage: product[0]?.images || "",
            amount: payment?.amount || "",
            address: {
              phoneNumber: address?.phoneNo || "",
              zipcode: address?.zipcode || "",
              state: address?.state || "",
              city: address?.city || "",
              fullAddress: address?.fullAddress || "",
              unitNumber: address?.unitNumber || "",
              typeOfAddress: address?.typeOfAddress || ""
            },
            paymentReferenceId: payment?.paymentId || "",
            userId: bookingResult?.userId || "",
            paymentId: bookingResult?.paymentId || "",
            quantity: bookingResult?.quantity || "",
            bookingTime: bookingResult?.bookingTime || "",
            currentStatus: bookingResult?.status || "",
            history: bookingResult?.statusHistory || [] 
          };
        return data;
      }

      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to delete Booking");
    }
  }

  //track booking by userID
  async trackUserBooking(bookingInputs: { userId: string, skip: number, limit: number }) {
    try {
      const bookingResult = await bookingModel.find({userId: bookingInputs?.userId}).skip(bookingInputs?.skip).limit(bookingInputs?.limit);

      if (bookingResult) {
        return Promise.all(bookingResult.map(async (element) => {
          const product: any = await productModel.aggregate([
            {
              $match: {
                _id: new Types.ObjectId(element?.productId),
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                  { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
                ],
                as: "userId",
              },
            },
          ]);
          
          if(product[0]?.images && product[0]?.images?.length > 0) {
            product[0].images.forEach(async(element: any) => {
              let newPath = await generatePresignedUrl(element?.imageName);
              element.path = newPath;
            });
          }

          const payment = await PaymentModel.findById(element?.paymentId);
          const address = await AddressModel.findById(element?.addressId);

          return {
            _id: element?._id || "",
            productId: element?.productId || "",
            productName: product[0]?.name || "",
            productImage: product[0]?.images || "",
            amount: payment?.amount || "",
            address: {
              phoneNumber: address?.phoneNo || "",
              zipcode: address?.zipcode || "",
              state: address?.state || "",
              city: address?.city || "",
              fullAddress: address?.fullAddress || "",
              unitNumber: address?.unitNumber || "",
              typeOfAddress: address?.typeOfAddress || ""
            },
            paymentReferenceId: payment?.paymentId || "",
            userId: element?.userId || "",
            paymentId: element?.paymentId || "",
            quantity: element?.quantity || "",
            bookingTime: element?.bookingTime || "",
            currentStatus: element?.status || "",
            history: element?.statusHistory || [] 
          };
        }));
      }      

      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to delete Booking");
    }
  }

  //track booking
  async trackBooking(bookingInputs: { skip: number, limit: number }) {
    try {
      const bookingResult = await bookingModel.find().skip(bookingInputs?.skip).limit(bookingInputs?.limit);

      if (bookingResult) {
        return Promise.all(bookingResult.map(async (element) => {
          const product: any = await productModel.aggregate([
            {
              $match: {
                _id: new Types.ObjectId(element?.productId),
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                  { $project: { _id: 1, email: 1, phoneNo: 1, roleId: 1, bussinessType: 1, loginType: 1 } },
                ],
                as: "userId",
              },
            },
          ]);
          
          if(product[0]?.images && product[0]?.images?.length > 0) {
            product[0].images.forEach(async(element: any) => {
              let newPath = await generatePresignedUrl(element?.imageName);
              element.path = newPath;
            });
          }

          const payment = await PaymentModel.findById(element?.paymentId);
          const address = await AddressModel.findById(element?.addressId);

          return {
            _id: element?._id || "",
            productId: element?.productId || "",
            productName: product[0]?.name || "",
            productImage: product[0]?.images || "",
            amount: payment?.amount || "",
            address: {
              phoneNumber: address?.phoneNo || "",
              zipcode: address?.zipcode || "",
              state: address?.state || "",
              city: address?.city || "",
              fullAddress: address?.fullAddress || "",
              unitNumber: address?.unitNumber || "",
              typeOfAddress: address?.typeOfAddress || ""
            },
            paymentReferenceId: payment?.paymentId || "",
            userId: element?.userId || "",
            paymentId: element?.paymentId || "",
            quantity: element?.quantity || "",
            bookingTime: element?.bookingTime || "",
            currentStatus: element?.status || "",
            history: element?.statusHistory || [] 
          };
        }));
      }      

      return { message: "Booking not found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Track Booking");
    }
  }

  async BlockedBooking(bookingId: string, blockedReason: string) {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { isBlocked: true, blockedReason: blockedReason, status: "Blocked", $push: { statusHistory: "Blocked" } },
        { new: true }
      );

      return booking;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Delete User");
    }
  }

  async UnBlockBooking(bookingId: string) {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { isBlocked: false, blockedReason: '', status: "UnBlocked", $push: { statusHistory: "UnBlocked" } },
        { new: true }
      );

      return booking;
    } catch (error) {
      console.log("err", error);
      throw new Error("Error on Delete User");
    }
  }

  //count booking
  async CountProductBooking(bookingInputs: { productId: string }) {
    try {
      const ActiveRenting = await bookingModel.countDocuments({productId: new Types.ObjectId(bookingInputs.productId), status: { $in: ["Delivered", "Confirmed", "Shipped"] } });
      const Requests = await bookingModel.countDocuments({productId: new Types.ObjectId(bookingInputs.productId),  status:"Requested"});
      const Rented = await bookingModel.countDocuments({productId: new Types.ObjectId(bookingInputs.productId),  status: "Returned"});
      const Requested = await bookingModel.countDocuments({ productId: new Types.ObjectId(bookingInputs.productId), status: { $in: ["Requested", "Delivered", "Confirmed", "Shipped", "Canceled", "Returned"] } });

      return {ActiveRenting, Requests, Rented, Requested};
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Count Booking");
    }
  }

  async CountUserBooking(bookingInputs: { userId: string }) {
    try {
      const ActiveRenting = await bookingModel.countDocuments({userId: bookingInputs.userId, status: { $in: ["Delivered", "Confirmed", "Shipped"] } });
      const Requests = await bookingModel.countDocuments({userId: bookingInputs.userId,  status:"Requested"});
      const Rented = await bookingModel.countDocuments({userId: bookingInputs.userId,  status: "Returned"});
      const Requested = await bookingModel.countDocuments({ userId: bookingInputs.userId, status: { $in: ["Requested", "Delivered", "Confirmed", "Shipped", "Canceled", "Returned"] } });
  
      return {ActiveRenting, Requests, Rented, Requested};
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Count Booking");
    }
  }

  async CountUsersProductBooking(bookingInputs: { userId: string }) {
    try {
        const Booking = await bookingModel.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
        ]);

        let ActiveRenting = 0;
        let Requests = 0;
        let Rented = 0;

        Booking.forEach(element => {          
            if(element.product.userId ===  new Types.ObjectId(bookingInputs.userId)){
              if (element.status === "Delivered" || element.status === "Confirmed" || element.status === "Shipped") {
                ActiveRenting++;
            } else if (element.status === "Requested") {
                Requests++;
            } else if (element.status === "Returned") {
                Rented++;
            }
          }
        });

        // Count the total number of requested bookings
        const Requested = await bookingModel.countDocuments({ userId: bookingInputs.userId, status: { $in: ["Requested", "Delivered", "Confirmed", "Shipped", "Canceled", "Returned"] } });

        return { ActiveRenting, Requests, Rented, Requested };
    } catch (err) {
        console.log("error", err);
        throw new Error("Unable to Count Booking");
    }
  }

  async getProductPaymentSum(paymentInput: { productId: string }) {
    try {
      const productId = paymentInput.productId;
      const result = await bookingModel.aggregate([
        { $match: { productId: new Types.ObjectId(productId), isDeleted: false, isBlocked: false, isAccepted: true } },
        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$price" },
            totalAmount: { $sum: "$totalAmount" }
          },
        },
      ]);

      // Extract the totalAmount from the result
      const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      return {totalPrice, totalAmount};
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to fetch payment Sum of productId");
    }
  }

  async getUserIdPaymentSum(paymentInput: { userId: string }) {
    const userId = paymentInput.userId;

    try {
      const result = await bookingModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), isDeleted: false, isBlocked: false, isAccepted: true } },
        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$price" },
            totalAmount: { $sum: "$totalAmount" }
          },
        },
      ]);

      // Extract the totalAmount from the result
      const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      return {totalPrice, totalAmount};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to fetch payment Sum of userId");
    }
  }

  async getOwnerPaymentSum(paymentInput: { owner: string }) {
    const acceptedBy = paymentInput.owner;

    try {
      const result = await bookingModel.aggregate([
        { $match: { acceptedBy: new Types.ObjectId(acceptedBy), isDeleted: false, isBlocked: false, isAccepted: true } },
        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$price" },
            totalAmount: { $sum: "$totalAmount" }
          },
        },
      ]);

      // Extract the totalAmount from the result
      const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      return {totalPrice, totalAmount};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to fetch payment Sum of userId");
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
