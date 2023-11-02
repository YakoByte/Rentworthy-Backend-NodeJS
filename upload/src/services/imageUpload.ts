import imageRepository from '../database/repository/imageUpload';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { imageRequest, imageRequests } from '../interface/imageUpload';

// All Business logic will be here
class imageService {
    private repository: imageRepository;

    constructor() {
        this.repository = new imageRepository();
    }
    // create image
    async CreateImage(imageInputs: imageRequest) {
        try {
            const existingImage: any = await this.repository.CreateImage({
                imageName: imageInputs.imageDetail.imageName,
                userId: imageInputs.userId,
                mimetype: imageInputs.imageDetail.mimetype,
                size: imageInputs.imageDetail.size,
                path: imageInputs.imageDetail.path,
            }); 

            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }

    async CreateImages(imageInputs: imageRequests) {
        try {
            const existingImage: any = await this.repository.CreateImages(imageInputs);

            return FormateData({ existingImage });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = imageService;
