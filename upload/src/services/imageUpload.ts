import imageRepository from "../database/repository/imageUpload";
import { FormateData, FormateError } from "../utils";

import {
  GetImageRequest,
  imageRequest,
  imageRequests,
} from "../interface/imageUpload";
import { deleteS3File, uploadS3File } from "../utils/aws";
import fs from "fs";
import cron from 'node-cron'

// All Business logic will be here
class imageService {
  private repository: imageRepository;

  constructor() {
    this.repository = new imageRepository();

    // setInterval(async () => {
    //   console.log('Running UpdateAllPath task...');
    //   await this.repository.UpdateAllPathAt6thDay();
    //   console.log('UpdateAllPath task completed.');
    // }, 604800);

    // cron.schedule('0 0 0 * * 0', this.repository.UpdateAllPathAt6thDay());
  }
  
  // create image
  async CreateImage(imageInputs: imageRequest) {
    try {
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
      for (let i = 0; i < imageInputs.imageDetails.length; i++) {
        if (fs.existsSync(imageInputs.imageDetails[i].path)) {
          fs.unlinkSync(imageInputs.imageDetails[i].path);
        }
      }
      return FormateError({ error: "Failed to create the multiple images" });
    }
  }

  // delete image
  async DeleteImage(_id: string) {
    try {
      const existingImage: any = await this.repository.DeleteImageById(_id);
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
        data = await this.repository.GetImageByName(imageInputs.search || "");
      } else if (imageInputs.imageName) {
        data = await this.repository.GetImageByName(imageInputs.imageName || "");
      } else {
        data = await this.repository.GetAllImages();
      }
      return FormateData(data);
    } catch (err: any) {
      return FormateError({ error: "Failed to Fetch the images" });
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
      return FormateError({ error: "Failed to Get the images By Id" });
    }
  }

  // get image by id
  async GetAllImages() {
    try {
      const existingImage: any = await this.repository.GetAllImages();
      if (!existingImage) return FormateError({ error: "No Image Found" });
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to Get the images" });
    }
  }

  async UpdateAllPath() {
    try {
      const existingImage: any = await this.repository.UpdateAllPath();
      if (!existingImage) return FormateError({ error: "No Image Found" });
      return FormateData(existingImage);
    } catch (err: any) {
      return FormateError({ error: "Failed to Update the images" });
    }
  }
}

export = imageService;
