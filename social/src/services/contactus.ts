import ContactUsRepository from '../database/repository/contactus';
import { FormateData, FormateError } from '../utils';

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
            const existingContactUs: any = await this.repository.CreateContactUs(
                ContactUsInputs
            );

            return FormateData(existingContactUs);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create contact us" });
        }
    }
}

export = ContactUsService;
