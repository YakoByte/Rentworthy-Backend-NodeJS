import { stripe } from "../utils/stripe"
import { PaymentConfirmDetails, PaymentCount, PaymentDetails } from "../interface/payment"
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
            currency: "usd",
            payment_method_types: ['card'],
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

    async PaymentTransfer(PaymentDetails: PaymentConfirmDetails) {
        const transfer = await stripe.transfers.create({
            amount: PaymentDetails.vendorAmount,
            currency: 'usd',
            destination: 'VENDOR_STRIPE_ACCOUNT_ID',
        });
        return FormateData({ transfer });
    }

    // verify stripe Id

    async VerifyStripeId(stripeId: string, userId: string) {
        try {
            const customer = await stripe.customers.retrieve(stripeId);
            console.log('Stripe ID is valid:', customer.id);
            if(customer){
                await this.repository.VerifyStripeId(stripeId, userId);
            }
            return FormateData({ customer });
        } catch (error: any) {
            console.error('Error verifying Stripe ID:', error.message);
            return FormateData({ message: error.message });
        }
    }

    async createTestCustomer() {
        try {
            const customer = await stripe.customers.create({
                email: 'test@example.com',
            });
            console.log('Test Customer ID:', customer.id);
            return FormateData({ customer });
        } catch (error: any) {
            console.error('Error creating test customer:', error.message);
        }
    }

    // async deleteTestCustomer(customerId) {
    //     try {
    //         const deletedCustomer = await stripe.customers.del(customerId);
    //         console.log('Test Customer Deleted:', deletedCustomer.id);
    //     } catch (error) {
    //         console.error('Error deleting test customer:', error.message);
    //     }
    // }
    
    async getPaymentSum(payDetails: PaymentCount) {
        try {
            if(payDetails.productId){
                const ProductPayment = await this.repository.getProductIdPaymentSum({
                    productId: payDetails.productId
                });
        
                return FormateData({ ProductPayment });
            } else if (payDetails.userId){
                const ProductPayment = await this.repository.getUserIdPaymentSum({
                    userId: payDetails.productId
                });
        
                return FormateData({ ProductPayment });
            }
        } catch (err) {
            console.error("Error in getProductIdPaymentSum:", err);
            // You may choose to handle or rethrow the error here
            throw err;
        }
    }  
}

export = PaymentService;
