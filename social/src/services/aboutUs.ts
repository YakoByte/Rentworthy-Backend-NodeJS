import AboutUSRepository from '../database/repository/aboutUs';
import { FormateData, FormateError } from '../utils';

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

            return FormateData(existingAboutUS);;
        } catch (err: any) {
            return FormateError({ error: "Failed to Create aboutUs" });
        }
    }
    // get AboutUS by id
    // async getAboutUSById(AboutUSInputs: aboutUSGetRequest) {
    //     try {
    //         let existingAboutUS = await this.repository.getAboutUSById(
    //             AboutUSInputs
    //         );

    //         return FormateData({ existingAboutUS });
    //     } catch (err: any) {
    //         console.log("err", err)
    //         return FormateData(err)
    //     }
    // }
    // // get All AboutUS
    // async getAllAboutUS(AboutUSInputs: aboutUSGetRequest) {
    //     try {
    //         let existingAboutUS: any
    //         existingAboutUS = await this.repository.getAllAboutUS();

    //         return FormateData({ existingAboutUS });
    //     } catch (err: any) {
    //         console.log("err", err)
    //         return FormateData(err)
    //     }
    // }
    // get AboutUS by id
    async getAboutUS(AboutUSInputs: aboutUSGetRequest) {
        try {
            let existingAboutUS: any
            existingAboutUS = await this.repository.getAboutUS(
                AboutUSInputs
            );

            return FormateData(existingAboutUS);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get aboutUs" });
        }
    }

    // add images to AboutUS
    async addImagesToAboutUS(AboutUSInputs: aboutUSUpdateRequest) {
        try {
            const existingAboutUS: any = await this.repository.addImagesToAboutUS(
                AboutUSInputs
            );

            return FormateData(existingAboutUS);
        } catch (err: any) {
            return FormateError({ error: "Failed to add image aboutUs" });
        }
    }
    // update AboutUS by id
    async updateById(AboutUSInputs: aboutUSUpdateRequest) {
        try {
            const existingAboutUS: any = await this.repository.updateAboutUSById(
                AboutUSInputs
            );

            return FormateData(existingAboutUS);
        } catch (err: any) {
            return FormateError({ error: "Failed to update aboutUs" });
        }
    }

    // delete AboutUS by id  (soft delete)
    async deleteAboutUS(AboutUSInputs: aboutUSDeleteRequest) {
        try {
            const existingAboutUS: any = await this.repository.deleteAboutUSById(
                AboutUSInputs
            );

            return FormateData(existingAboutUS);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete aboutUs" });
        }
    }

}

export = AboutUSService;
