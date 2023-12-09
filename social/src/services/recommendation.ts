import recommendationRepository from '../database/repository/recommendation';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { recommendationRequest } from '../interface/recommendation';

// All Business logic will be here
class recommendationService {
    private repository: recommendationRepository;

    constructor() {
        this.repository = new recommendationRepository();
    }
    // create recommendation
    async CreateRecommendation(recommendationInputs: recommendationRequest) {
        try {
            console.log("recommendationInputs", recommendationInputs)
            const existingRecommendation: any = await this.repository.Createrecommendation(
                recommendationInputs
            );

            return FormateData({ existingRecommendation });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
}

export = recommendationService;
