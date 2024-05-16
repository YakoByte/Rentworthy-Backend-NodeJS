import { recommendationModel } from "../models";
import { recommendationRequest } from "../../interface/recommendation";

class RecommendationRepository {
  //create expandDate
  async Createrecommendation(recommendationInputs: recommendationRequest) {
    try {
      let existingRec: any = await recommendationModel
        .findOne({
          userId: recommendationInputs.userId,
        })
        .lean();
      let returnVal;
      if (existingRec) {
        let i = 0;
        while ((recommendationInputs.subCategoryId.length as number) !== 5) {
          if (i == existingRec.subCategoryId.length) {
            break;
          }
          recommendationInputs.subCategoryId.push(existingRec.subCategoryId[i]);
          i++;
        }
        returnVal = await recommendationModel.findOneAndUpdate(
          {
            userId: recommendationInputs.userId,
          },
          {
            $set: {
              subCategoryId: recommendationInputs.subCategoryId,
            },
          },
          {
            new: true,
          }
        );
      } else {
        returnVal = await recommendationModel.create(recommendationInputs);
      }
      return returnVal;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Recommendation");
    }
  }
}

export default RecommendationRepository;
