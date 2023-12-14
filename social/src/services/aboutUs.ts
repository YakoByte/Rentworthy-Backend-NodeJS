import AboutUSRepository from '../database/repository/aboutUs';
import { FormateData } from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { aboutUSRequest, aboutUSUpdateRequest, aboutUSGetRequest, aboutUSDeleteRequest } from '../interface/aboutUs';

// All Business logic will be here
class AboutUSService {
    private repository: AboutUSRepository;

    constructor() {
        this.repository = new AboutUSRepository();
    }
    // create AboutUS
    async CreateAboutUS(AboutUSInputs: aboutUSRequest) {
        try {
            console.log("AboutUSInputs", AboutUSInputs)
            const existingAboutUS: any = await this.repository.CreateAboutUS(
                AboutUSInputs
            );

            return existingAboutUS;
        } catch (err: any) {
            console.log("err", err.message)
            return ({ message: "Data Not found", err });
        }
    }
    // get AboutUS by id
    async getAboutUSById(AboutUSInputs: aboutUSGetRequest) {
        try {
            let existingAboutUS = await this.repository.getAboutUSById(
                AboutUSInputs
            );

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get All AboutUS
    async getAllAboutUS(AboutUSInputs: aboutUSGetRequest) {
        try {
            let existingAboutUS: any
            existingAboutUS = await this.repository.getAllAboutUS();

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get AboutUS by id
    async getAboutUS(AboutUSInputs: aboutUSGetRequest) {
        try {
            let existingAboutUS: any
            existingAboutUS = await this.repository.getAboutUS(
                AboutUSInputs
            );

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // add images to AboutUS
    async addImagesToAboutUS(AboutUSInputs: aboutUSUpdateRequest) {
        try {
            const existingAboutUS: any = await this.repository.addImagesToAboutUS(
                AboutUSInputs
            );

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update AboutUS by id
    async updateById(AboutUSInputs: aboutUSUpdateRequest) {
        try {
            const existingAboutUS: any = await this.repository.updateAboutUSById(
                AboutUSInputs
            );

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete AboutUS by id  (soft delete)
    async deleteAboutUS(AboutUSInputs: aboutUSDeleteRequest) {
        try {
            const existingAboutUS: any = await this.repository.deleteAboutUSById(
                AboutUSInputs
            );

            return FormateData({ existingAboutUS });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = AboutUSService;
