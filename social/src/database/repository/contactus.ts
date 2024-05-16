import { contactUsModel } from "../models";
import { ContactUsInput } from "../../interface/contactus";
class ContactUsRepository {
  //create expandDate
  async CreateContactUs(ContactUsInputs: ContactUsInput) {
    try {
      let returnVal = await contactUsModel.create(ContactUsInputs);
      return returnVal;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Crete Contact US");
    }
  }
}

export default ContactUsRepository;
