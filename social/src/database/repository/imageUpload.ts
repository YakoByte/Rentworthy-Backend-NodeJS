import { imageModel, historyModel } from "../models";
import { imageRequest, imageRequests } from "../../interface/imageUpload";

class ImageRepository {
  //create image
  async CreateImage(imageInputs: imageRequest) {
    try {
      const image = new imageModel(imageInputs);
      const imageResult = await image.save();

      // create history
      const history = new historyModel({
        imageId: imageResult._id,
        log: [
          {
            objectId: imageResult._id,
            data: {
              userId: imageInputs.userId,
            },
            action: `imageName = ${imageResult.imageName} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return imageResult._id;
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

      return imageResult.map(image => image._id);
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Multiple Image");
    }
  }
}

export default ImageRepository;
