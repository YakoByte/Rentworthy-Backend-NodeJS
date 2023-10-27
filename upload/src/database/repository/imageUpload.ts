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
import { imageRequest, imageDetail } from "../../interface/imageUpload";
class ImageRepository {
    //create image
    async CreateImage(imageInputs: imageDetail) {
        try {
            //create image 
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

}

export default ImageRepository;
