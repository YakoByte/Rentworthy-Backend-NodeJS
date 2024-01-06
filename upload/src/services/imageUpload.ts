import imageRepository from '../database/repository/imageUpload';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { imageRequest, imageRequests } from '../interface/imageUpload';
import { deleteS3File, uploadS3File } from '../utils/aws';
import fs from "fs";

// All Business logic will be here
class imageService {
    private repository: imageRepository;

    constructor() {
        this.repository = new imageRepository();
    }
    // create image
    async CreateImage(imageInputs: imageRequest) {
        try {
            if (imageInputs.imageDetail.mimetype !== "image/jpeg" && imageInputs.imageDetail.mimetype !== "image/png") {
                return FormateData({ message: "Invalid Image Type" });
            }
            const imagePath = imageInputs.imageDetail.path;
            const imageMimetype = imageInputs.imageDetail.mimetype;
            const imageSize = imageInputs.imageDetail.size;
            const newImageName = `${Date.now()}_${imageInputs.imageDetail.imageName}`;
        
            const newImagePath = await uploadS3File(imagePath, newImageName);
        
            // delete the file if it exists
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }

            const existingImage: any = await this.repository.CreateImage({
                imageName: newImageName,
                userId: imageInputs.userId,
                mimetype: imageMimetype,
                size: imageSize,
                path: newImagePath,
            });

            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async CreateImages(imageInputs: imageRequests) {
        try {
            let imagePayload: any = [];
            for (let i = 0; i < imageInputs.imageDetails.length; i++) {
                if (imageInputs.imageDetails[i].mimetype !== "image/jpeg" && imageInputs.imageDetails[i].mimetype !== "image/png") {
                    return FormateData({ message: "Invalid Image Type" });
                }
                const imagePath = imageInputs.imageDetails[i].path;
                const imageMimetype = imageInputs.imageDetails[i].mimetype;
                const imageSize = imageInputs.imageDetails[i].size;
                const newImageName = `${Date.now()}_${imageInputs.imageDetails[i].filename}`;
            
                const newImagePath = await uploadS3File(imagePath, newImageName);
            
                // delete the file if it exists
                if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
                }

                let image = {
                    imageName: newImageName,
                    userId: imageInputs.userId,
                    mimetype: imageMimetype,
                    size: imageSize,
                    path: newImagePath,
                }
                imagePayload.push(image)
            }

            const existingImage: any = await this.repository.CreateImages(imagePayload);

            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // delete image
    async DeleteImage(id: string) {
        try {
            const existingImage: any = await this.repository.DeleteImageById(id);
            const ImageKey = existingImage.path.split('/').pop();
            await deleteS3File(ImageKey);
            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    // delete image by imageName
    async DeleteImageByName(imageName: string) {
        try {
            const existingImage: any = await this.repository.DeleteImageByName(imageName);
            const ImageKey = existingImage.path.split('/').pop();
            await deleteS3File(ImageKey);
            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = imageService;
