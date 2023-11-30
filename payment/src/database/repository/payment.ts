import { paymentModel } from "../models";
import axios from 'axios';

import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { PaymentConfirmDetails } from "../../interface/payment";
class PaymentRepository {

    async CreatePayment(PaymentInputs: PaymentConfirmDetails) {
        try {
            let response = await paymentModel.create(PaymentInputs)
            return FormateData(response)
        } catch (err) {
            console.log("err", err)
            return err;
        }
    }
}

export default PaymentRepository;
