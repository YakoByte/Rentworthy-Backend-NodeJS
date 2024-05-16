import recommendationRepository from '../database/repository/recommendation';
import { FormateData, FormateError } from '../utils';

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

            return FormateData(existingRecommendation);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Recommendation" });
        }
    }
}

export = recommendationService;
