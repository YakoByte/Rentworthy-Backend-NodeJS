import { imageModel, historyModel } from "../models";
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
import { imageRequest, imageDetail, imageRequests } from "../../interface/imageUpload";
class ImageRepository {
    //create image
    async CreateImage(imageInputs: imageDetail) {
        try {
            // check mimetype and size of image
            if (imageInputs.mimetype !== "image/jpeg" && imageInputs.mimetype !== "image/png") {
                return FormateData({ message: "Invalid Image Type" });
            }
            const image = new imageModel(imageInputs);
            const imageResult = await image.save();
            console.log("imageResult", imageResult)
            // create history
            const history = new historyModel({
                imageId: imageResult._id,
                log: [
                    {
                        objectId: imageResult._id,
                        data: {
                            userId: imageInputs.userId,
                        },
                        action: `imageName = ${imageInputs.imageName} created`,
                        date: new Date().toISOString(),
                        time: Date.now(),
                    },
                ],
            });
            await history.save();

            return imageResult;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create User"
            );
        }
    }
    // create images
    async CreateImages(imageInputs: imageRequests) {
        try {
            let imagePayload: any = [];
            for (let i = 0; i < imageInputs.imageDetails.length; i++) {
                if (imageInputs.imageDetails[i].mimetype !== "image/jpeg" && imageInputs.imageDetails[i].mimetype !== "image/png") {
                    return FormateData({ message: "Invalid Image Type" });
                }
                let image = {
                    imageName: imageInputs.imageDetails[i].filename,
                    userId: imageInputs.userId,
                    mimetype: imageInputs.imageDetails[i].mimetype,
                    size: imageInputs.imageDetails[i].size,
                    path: `http://localhost:4000/images/${imageInputs.imageDetails[i].filename}`,
                }
                imagePayload.push(image)
            }
            const imageResult = await imageModel.insertMany(imagePayload);
            // create histories
            for (let i = 0; i < imageResult.length; i++) {
                let history = new historyModel({
                    userId: imageInputs.userId,
                    log: [
                        {
                            objectId: imageResult[i]._id,
                            data: {
                                image: imageResult[i]
                            },
                            action: `imageName = ${imageResult[i].imageName} created`,
                            date: new Date().toISOString(),
                            time: Date.now(),
                        },
                    ],
                });
                await history.save();
            }

            return imageResult;
        } catch (err) {
            console.log("err", err)
            return new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create User"
            );
        }
    }

}

export default ImageRepository;
