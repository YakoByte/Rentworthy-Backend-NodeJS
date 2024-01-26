import { imageModel, historyModel } from "../models";
import { imageDetail, imageRequests } from "../../interface/imageUpload";
import { generatePresignedUrl } from "../../utils/aws";

class ImageRepository {
  //create image
  async CreateImage(imageInputs: imageDetail) {
    try {
      const image = new imageModel(imageInputs);
      const imageResult = await image.save();
      console.log("imageResult", imageResult);
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
      console.log("error", err);
      throw new Error("Unable to Create Image");
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
                image: imageResult[i],
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
      console.log("error", err);
      throw new Error("Unable to Create Multiple Image");
    }
  }

  // delete image
  async DeleteImageById(id: string) {
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
          image: image,
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
      await imageModel.findByIdAndDelete(id);

      // Return the deleted image
      return image;
    } catch (error) {
      // Handle errors appropriately
      console.log("error", error);
      throw new Error("Unable to Delete Image");
    }
  }

  // delete image by imageName
  async DeleteImageByName(imageName: string) {
    try {
      // Find the image
      const image = await imageModel.findOne({ imageName: imageName });

      // If the image doesn't exist, throw an error
      if (!image) {
        throw new Error("Image not found");
      }

      // Create history log
      const historyEntry = {
        objectId: image._id,
        data: {
          image: image,
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
      await imageModel.findOneAndDelete({ imageName: imageName });

      // Return the deleted image
      return image;
    } catch (error) {
      // Handle errors appropriately
      console.log("error", error);
      throw new Error("Unable to Delete Image By Name");
    }
  }

  async GetImageByName(imageName: string) {
    try {
      // Find the image
      const image = await imageModel.findOne({ imageName: imageName });

      // If the image doesn't exist, throw an error
      if (!image) {
        throw new Error("Image not found");
      }

      const path = await generatePresignedUrl(imageName);

      // update the image
      const updateImage = await imageModel.findOneAndUpdate({
        imageName: imageName,
        path: path,
      });

      // Return the deleted image
      return updateImage;
    } catch (error) {
      // Handle errors appropriately
      console.log("error", error);
      throw new Error("Unable to Get Image By Name");
    }
  }

  async GetImageById(_id: string) {
    try {
      // Find the image
      const image = await imageModel.findById(_id);

      // If the image doesn't exist, throw an error
      if (!image) {
        throw new Error("Image not found");
      }

      const path = await generatePresignedUrl(image.imageName);

      // update the image
      const updateImage = await imageModel.findOneAndUpdate({
        _id: _id,
        path: path,
      });

      // Return the deleted image
      return updateImage;
    } catch (error) {
      // Handle errors appropriately
      console.log("error", error);
      throw new Error("Unable to Get Image By Id");
    }
  }

  async GetAllImages() {
    try {
      // Find the images
      const images = await imageModel.find();

      // If no images are found, throw an error
      if (!images || images.length === 0) {
        throw new Error("No images found");
      }

      const updateImagePromises = images.map(async (element) => {
        try {
          const path = await generatePresignedUrl(element.imageName);

          // Update the image
          const imageUpdate = await imageModel.findOneAndUpdate(
            { _id: element._id },
            { path: path },
            { new: true } // to return the updated document
          );

          return imageUpdate;
        } catch (error) {
          // Handle errors during the iteration
          console.error(
            `Error updating image with ID ${element._id}: ${error}`
          );
          throw error;
        }
      });

      // Wait for all updates to complete
      const updatedImages = await Promise.all(updateImagePromises);

      // Return the updated images
      return updatedImages;
    } catch (error) {
      // Handle errors appropriately
      console.error("Error in GetAllImages:", error);
      throw new Error("Unable to get images");
    }
  }
}

export default ImageRepository;
