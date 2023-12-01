import { stripe } from "../utils/stripe"
import { PaymentConfirmDetails, PaymentDetails } from "../interface/payment"
import paymentRepository from '../database/repository/payment';

import { FormateData } from "../utils";

class PaymentService {

    private repository: paymentRepository;

    constructor() {
        this.repository = new paymentRepository();
    }
    async createPaymentIntent(PaymentDetails: PaymentDetails) {
        const { client_secret } = await stripe.paymentIntents.create({
            amount: PaymentDetails.amount,
            currency: PaymentDetails.currency,
            payment_method: "card",
        });
        return FormateData({ client_secret });
    }

    async confirmPaymentIntent(PaymentDetails: PaymentConfirmDetails) {
        const paymentIntent = await stripe.paymentIntents.confirm(PaymentDetails.paymentIntentId, {
            payment_method: PaymentDetails.paymentMethodId,
        });
        if (paymentIntent.status === 'succeeded') {
            // Payment succeeded
            let payDetails: any = await this.repository.CreatePayment(PaymentDetails)
            return FormateData({ message: 'Payment succeeded!', payStatus: paymentIntent.status, paymentId: payDetails._id });
        } else if (paymentIntent.status === 'requires_action') {
            // Payment requires additional action (e.g., 3D Secure authentication)
            return FormateData({ message: 'Additional action required for payment!', payStatus: paymentIntent.status });
        } else {
            // Payment failed or requires a different payment method
            return FormateData({ message: 'Payment failed or requires a different payment method!', payStatus: paymentIntent.status });
        }
    }
}

export = PaymentService;
