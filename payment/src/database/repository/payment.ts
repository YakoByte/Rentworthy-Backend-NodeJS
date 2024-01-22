import { UserModel, paymentModel } from "../models";
import axios from 'axios';

import { FormateData } from '../../utils';
import { PaymentConfirmDetails, PaymentCount } from "../../interface/payment";

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

    async VerifyStripeId(stripeId: string, userId: string) {
        try {
            let response = await UserModel.findOneAndUpdate(
                { userId, isStripeIdVerified: false },
                { isStripeIdVerified: true, stripeId: stripeId },
                { new: true }
            );
            return FormateData(response);
        } catch (err) {
            console.error("Error:", err);
            return err;
        }
    }    

    async getProductIdPaymentSum(paymentInput: PaymentCount) {
        const productId = paymentInput.productId;
        console.log(productId);
        
        try {
            const result = await paymentModel.aggregate([
                { $match: { productId: productId } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$price" }
                    }
                }
            ]);
    
            // Extract the totalAmount from the result
            const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    
            return FormateData(totalAmount);
        } catch (error) {
            console.error('Error in getProductIdPaymentSum:', error);
            return 0;
        }
    }

    async getUserIdPaymentSum(paymentInput: PaymentCount) {
        const userId = paymentInput.userId;
    
        try {
            const result = await paymentModel.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$price" }
                    }
                }
            ]);
    
            // Extract the totalAmount from the result
            const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    
            return FormateData(totalAmount);
        } catch (error) {
            console.error('Error in getUserIdPaymentSum:', error);
            return 0;
        }
    }
}

export default PaymentRepository;
