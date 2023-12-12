import ContactUsRepository from '../database/repository/contactus';
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { ContactUsInput } from '../interface/contactus';

// All Business logic will be here
class ContactUsService {
    private repository: ContactUsRepository;

    constructor() {
        this.repository = new ContactUsRepository();
    }
    // create ContactUs
    async createContactUs(ContactUsInputs: ContactUsInput) {
        try {
            console.log("ContactUsInputs", ContactUsInputs)
            const existingContactUs: any = await this.repository.CreateContactUs(
                ContactUsInputs
            );

            return FormateData({ existingContactUs });
        } catch (err: any) {
            console.log("err", err.message)
            throw new APIError("Data Not found", err);
        }
    }
}

export = ContactUsService;
