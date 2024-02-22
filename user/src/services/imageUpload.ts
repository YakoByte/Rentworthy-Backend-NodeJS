import imageRepository from "../database/repository/imageUpload";
import { FormateData, FormateError } from "../utils";
import { imageRequest, imageRequests } from "../interface/imageUpload";
import { deleteS3File, uploadS3File } from "../utils/aws";
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
      const imagePath = imageInputs.imageDetail.path;
      const imageMimetype = imageInputs.imageDetail.mimetype;
      const imageSize = imageInputs.imageDetail.size;
      const newImageName = `${Date.now()}_${imageInputs.imageDetail.imageName}`;

      const newImagePath = await uploadS3File(imagePath, newImageName);

      // delete the file if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      let imagePayload: any = {
        imageName: newImageName,
        mimetype: imageMimetype,
        size: imageSize,
        path: newImagePath,
        userId: imageInputs.userId,
      };

      const existingImage: any = await this.repository.CreateImage(imagePayload);

      return FormateData(existingImage);
    } catch (err: any) {
      if (fs.existsSync(imageInputs.imageDetail.path)) {
        fs.unlinkSync(imageInputs.imageDetail.path);
      }
      return FormateError({ error: "Failed to create the image" });
    }
  }

  async CreateImages(imageInputs: imageRequests) {
    try {
      let imagePayload: any = [];
      for (let i = 0; i < imageInputs.imageDetails.length; i++) {
        const imagePath = imageInputs.imageDetails[i].path;
        const imageMimetype = imageInputs.imageDetails[i].mimetype;
        const imageSize = imageInputs.imageDetails[i].size;
        const newImageName = `${Date.now()}_${
          imageInputs.imageDetails[i].imageName
        }`;

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
        };
        imagePayload.push(image);
      }

      const existingImage: any = await this.repository.CreateImages(
        imagePayload
      );

      return FormateData(existingImage);
    } catch (err: any) {
      for (let i = 0; i < imageInputs.imageDetails.length; i++) {
        if (fs.existsSync(imageInputs.imageDetails[i].path)) {
          fs.unlinkSync(imageInputs.imageDetails[i].path);
        }
      }
      return FormateError({ error: "Failed to create the multiple images" });
    }
  }
}

export = imageService;
