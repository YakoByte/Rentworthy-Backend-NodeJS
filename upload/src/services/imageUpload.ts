import imageRepository from "../database/repository/imageUpload";
import { FormateData, FormateError } from "../utils";

import {
  GetImageRequest,
  imageRequest,
  imageRequests,
} from "../interface/imageUpload";
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
      if (
        imageInputs.imageDetail.mimetype !== "image/jpeg" &&
        imageInputs.imageDetail.mimetype !== "image/png"
      ) {
        return FormateError({ error: "Invalid Image Type" });
      }

      console.log("imageInputs", imageInputs);
      const imagePath = imageInputs.imageDetail.path;
      const imageMimetype = imageInputs.imageDetail.mimetype;
      const imageSize = imageInputs.imageDetail.size;
      const newImageName = `${Date.now()}_${
        imageInputs.imageDetail.originalname
      }`;

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

      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to create the image" });
    }
  }

  async CreateImages(imageInputs: imageRequests) {
    try {
      let imagePayload: any = [];
      for (let i = 0; i < imageInputs.imageDetails.length; i++) {
        if (
          imageInputs.imageDetails[i].mimetype !== "image/jpeg" &&
          imageInputs.imageDetails[i].mimetype !== "image/png"
        ) {
          return FormateError({ error: "Invalid Image Type" });
        }
        const imagePath = imageInputs.imageDetails[i].path;
        const imageMimetype = imageInputs.imageDetails[i].mimetype;
        const imageSize = imageInputs.imageDetails[i].size;
        const newImageName = `${Date.now()}_${
          imageInputs.imageDetails[i].filename
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
      return FormateError({ error: "Failed to create the multiple images" });
    }
  }

  // delete image
  async DeleteImage(id: string) {
    try {
      const existingImage: any = await this.repository.DeleteImageById(id);
      const ImageKey = existingImage.imageName;
      await deleteS3File(ImageKey);
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to delete the images" });
    }
  }

  // delete image by imageName
  async DeleteImageByName(imageName: string) {
    try {
      const existingImage: any = await this.repository.DeleteImageByName(
        imageName
      );
      await deleteS3File(imageName);
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to delete the images By Name" });
    }
  }

  // get image
  async GetImage(imageInputs: GetImageRequest) {
    try {
      let data;
      if (imageInputs._id) {
        data = await this.repository.GetImageById(imageInputs._id);
      } else if (imageInputs.search) {
        data = await this.repository.GetImageByName(imageInputs.search || '');
      } else if (imageInputs.imageName) {
        data = await this.repository.GetImageByName(imageInputs.imageName || '');
      } else {
        data = await this.repository.GetAllImages();
      }
      return FormateData(data);
    } catch (err: any) {
      return FormateError({ error: "Failed to delete the images By Name" });
    }
  }

  // get image by imageName
  async GetImageByName(imageName: string) {
    try {
      const existingImage: any = await this.repository.GetImageByName(
        imageName
      );
      if (!existingImage) return FormateError({ error: "No Image Found" });
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to Get the images By Name" });
    }
  }

  // get image by id
  async GetImageById(_id: string) {
    try {
      const existingImage: any = await this.repository.GetImageById(_id);
      if (!existingImage) return FormateError({ error: "No Image Found" });
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to Get the images By Name" });
    }
  }

  // get image by id
  async GetAllImages() {
    try {
      const existingImage: any = await this.repository.GetAllImages();
      if (!existingImage) return FormateError({ error: "No Image Found" });
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to Get the images By Name" });
    }
  }
}

export = imageService;
