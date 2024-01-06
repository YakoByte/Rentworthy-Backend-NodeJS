import { contactUsModel } from "../models";
import {
  FormateData,
  // GeneratePassword,
  // GenerateSalt,
  // GenerateSignature,
  // ValidatePassword,
} from "../../utils";
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { ContactUsInput } from "../../interface/contactus";
class ContactUsRepository {
  //create expandDate
  async CreateContactUs(ContactUsInputs: ContactUsInput) {
    try {
     let returnVal = await contactUsModel.create(ContactUsInputs)
      FormateData(returnVal)
    } catch (err) {
      console.log("err", err);
      return err;
    }
  }
}

export default ContactUsRepository;
