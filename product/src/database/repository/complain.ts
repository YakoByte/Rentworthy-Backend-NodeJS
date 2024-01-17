import { ComplainModel, historyModel } from "../models";
import { Types } from 'mongoose';
import { FormateData } from '../../utils';
import { BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { ComplainRequest, ComplainDeleteRequest, ComplainUpdateRequest, ComplainGetRequest } from "../../interface/complain";

class ComplainRepository {
    //create Complain
    async CreateComplain(ComplainInputs: ComplainRequest) {
        // try {
        const findComplain = await ComplainModel.findOne({ productId: ComplainInputs.productId, userId: ComplainInputs.userId });
        console.log("findComplain", findComplain)
        
        if (findComplain) {
            return FormateData({ id: findComplain._id, name: findComplain.name });
        }

        const Complain = new ComplainModel(ComplainInputs);
        const ComplainResult = await Complain.save();

        const history = new historyModel({
            ComplainId: ComplainInputs._id,
            log: [
                {
                    objectId: ComplainInputs._id,
                    userId: ComplainInputs.userId,
                    action: `ComplainName = ${ComplainInputs.name} updated`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        
        await history.save();

        return ComplainResult;
    }

    //get Complain by id
    async getComplainById(ComplainInputs: { _id: string }) {
        try {
            const findComplain = await ComplainModel.aggregate([
                { $match: { _id: new Types.ObjectId(ComplainInputs._id), isDeleted: false } },
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

            console.log("findComplain", findComplain)
            if (findComplain) {
                return { STATUS_CODE: STATUS_CODES.OK, data: findComplain };
            }
        } catch (err: any) {
            return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, data: [], message: err.message })
        }
    }

    // get Complain by user id
    async getComplainByUserId(ComplainInputs: ComplainGetRequest) {
        try {
            const findComplain = await ComplainModel.aggregate([
                { $match: { userId: new Types.ObjectId(ComplainInputs.userId), isDeleted: false } },
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

            console.log("findComplain", findComplain)
            if (findComplain) {
                return FormateData(findComplain);
            }
        } catch (err: any) {
            return new BadRequestError("Data Not found", err);
        }
    }

    // get Complain by product id
    async getComplainByProductId(ComplainInputs: ComplainGetRequest) {
        try {
            const findComplain = await ComplainModel.aggregate([
                { $match: { productId: new Types.ObjectId(ComplainInputs.productId), isDeleted: false } },
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

            console.log("findComplain", findComplain)
            if (findComplain) {
                return FormateData(findComplain);
            }
        } catch (err: any) {
            return new BadRequestError("Data Not found", err);
        }
    }

    //get all Complain
    async getAllComplain({ skip, limit }: { skip: number, limit: number }) {
        try {
            console.log("skip", skip, "limit", limit)
            const findComplain = await ComplainModel.aggregate([
                { $match: { isDeleted: false } },
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
            console.log("findComplain", findComplain)
            if (findComplain) {
                return ({ STATUS_CODE: STATUS_CODES.OK, data: findComplain });
            }
        } catch (err: any) {
            return ({ STATUS_CODE: STATUS_CODES.NOT_FOUND, data: [], message: err.message })
        }
    }

    // get Complain by location
    async getComplainByLocation(ComplainInputs: { lat: number, long: number }) {
        try {
            const findComplain = await ComplainModel.aggregate([
                { $match: { isDeleted: false } },
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [ComplainInputs.lat, ComplainInputs.long] },
                        distanceField: "dist.calculated",
                        maxDistance: 100000,
                        includeLocs: "dist.location",
                        spherical: true
                    }
                },
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
            console.log("findComplain", findComplain)
            if (findComplain) {
                return FormateData(findComplain);
            }
        } catch (err: any) {
            return new BadRequestError("Data Not found", err);
        }
    }

    // get Complain by name and search using regex
    async getComplainByName(ComplainInputs: { name: string }) {
        const findComplain = await ComplainModel.aggregate([
            { $match: { name: { $regex: ComplainInputs.name, $options: 'i' }, isDeleted: false } },
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
        console.log("findComplain", findComplain)
        if (findComplain) {
            return FormateData(findComplain);
        }
    }

    //update Complain name, description, isActive, isShow, image
    async updateComplain(ComplainInputs: ComplainUpdateRequest) {
        try {
            const ComplainResult = await ComplainModel.findOneAndUpdate(
                { _id: ComplainInputs._id, isDeleted: false },
                ComplainInputs,
                { new: true } // Return the modified document
            );
    
            if (ComplainResult) {
                const history = new historyModel({
                    ComplainId: ComplainInputs._id,
                    log: [
                        {
                            objectId: ComplainInputs._id,
                            userId: ComplainInputs.userId,
                            action: `ComplainName = ${ComplainInputs.name} updated`,
                            date: new Date().toISOString(),
                            time: Date.now(),
                        },
                    ],
                });
    
                await history.save();
                
                return { STATUS_CODES: STATUS_CODES.OK, data: "Complain Updated" };
            } else {
                return { STATUS_CODES: STATUS_CODES.NOT_FOUND, data: "Complain not found or already deleted" };
            }
        } catch (error) {
            console.error("Error updating complain:", error);
            return { STATUS_CODES: STATUS_CODES.INTERNAL_ERROR, data: "Error updating complain" };
        }
    }
    
    async deleteComplain(ComplainInputs: ComplainDeleteRequest) {
        const findComplain = await ComplainModel.findOne({ _id: ComplainInputs._id, isDeleted: false });
        console.log("findComplain", findComplain)
        
        if (findComplain) {
            // soft delete Complain
            const ComplainResult = await ComplainModel.updateOne({ _id: ComplainInputs._id }, { isDeleted: true });
            //create history
            const history = new historyModel({
                ComplainId: ComplainInputs._id,
                log: [
                    {
                        objectId: ComplainInputs._id,
                        userId: ComplainInputs.userId,
                        action: `ComplainName = ${findComplain.name} deleted and subComplain also deleted`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();
            return FormateData({ message: "Complain Deleted" });
        }
    }

}

export default ComplainRepository;
