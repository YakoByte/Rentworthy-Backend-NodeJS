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
            const imageResult = await imageModel.insertMany(imageInputs);
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

    // delete image
    async DeleteImage(id: string) {
        try {
            // Find the image
            const image = await imageModel.findById(id);
    
            // If the image doesn't exist, throw an error
            if (!image) {
                throw new Error("Image not found");
            }
    
            // Create history log
            const historyEntry = {
                objectId: image._id,
                data: {
                    image: image
                },
                action: `Image with name '${image.imageName}' deleted`,
                date: new Date().toISOString(),
                time: Date.now(),
            };
    
            const history = new historyModel({
                imageId: image._id,
                log: [historyEntry],
            });
    
            // Save history log
            await history.save();
    
            // Delete the image
            const deletedImage = await imageModel.findByIdAndDelete(id);
    
            // Return the deleted image
            return deletedImage;
        } catch (error) {
            // Handle errors appropriately
            console.error("Error deleting image:", error);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to delete image"
            );
        }
    }
    
}

export default ImageRepository;
