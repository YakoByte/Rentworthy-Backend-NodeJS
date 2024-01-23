import { stripe } from "../utils/stripe";
import {
  PaymentChargeDetails,
  PaymentConfirmDetails,
  PaymentCount,
  PaymentDetails,
  PaymentMethodDetails,
} from "../interface/payment";
import paymentRepository from "../database/repository/payment";

import { FormateData } from "../utils";
import { VENDOR_STRIPE_ACCOUNT_ID } from "../config";

class PaymentService {
  private repository: paymentRepository;

  constructor() {
    this.repository = new paymentRepository();
  }

  async createPaymentIntent(PaymentDetails: PaymentDetails) {
    const client_secret = await stripe.paymentIntents.create({
      amount: Math.floor(PaymentDetails.amount * 100),
      currency: PaymentDetails.currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return FormateData(client_secret);
  }

  // verify stripe Id
  async VerifyStripeId(stripeId: string, userId: string) {
    try {
      const customer = await stripe.paymentIntents.retrieve(stripeId);
      console.log("Stripe ID is valid:", customer.id);
      if (customer) {
        await this.repository.VerifyStripeId(stripeId, userId);
      }
      return FormateData({ customer });
    } catch (error: any) {
      console.error("Error verifying Stripe ID:", error.message);
      return FormateData({ message: error.message });
    }
  }

  async confirmPaymentIntent(PaymentDetails: PaymentConfirmDetails) {
    const paymentIntent = await stripe.paymentIntents.confirm(
      PaymentDetails.paymentIntentId,
      {
        payment_method: PaymentDetails.paymentMethodId,
      }
    );
    if (paymentIntent.status === "succeeded") {
      // Payment succeeded
      let payDetails: any = await this.repository.CreatePayment(PaymentDetails);
      return FormateData({
        message: "Payment succeeded!",
        payStatus: paymentIntent.status,
        paymentId: payDetails._id,
      });
    } else if (paymentIntent.status === "requires_action") {
      // Payment requires additional action (e.g., 3D Secure authentication)
      return FormateData({
        message: "Additional action required for payment!",
        payStatus: paymentIntent.status,
      });
    } else {
      // Payment failed or requires a different payment method
      return FormateData({
        message: "Payment failed or requires a different payment method!",
        payStatus: paymentIntent.status,
      });
    }
  }

  async PaymentTransfer(PaymentDetails: PaymentConfirmDetails) {
    const transfer = await stripe.transfers.create({
      amount: PaymentDetails.amount,
      currency: PaymentDetails.currency,
      destination: VENDOR_STRIPE_ACCOUNT_ID || "",
    });
    return FormateData({ transfer });
  }

  async createCustomer(name: string, email: string) {
    try {
      const customer = await stripe.customers.create({
        name: name,
        email: email,
      });
      console.log("Test Customer ID:", customer.id);
      return FormateData({ customer });
    } catch (error: any) {
      console.error("Error creating test customer:", error.message);
    }
  }

  async addNewCard(paymentDetails: PaymentMethodDetails) {
    try {
      const token = await stripe.tokens.create({
        card: paymentDetails.card,
      });

      const addedCard = await stripe.customers.createSource(
        paymentDetails.customer_id,
        {
          source: token.id,
        }
      );

      console.log("Added Card ID:", addedCard.id);
      return FormateData({ card: addedCard });
    } catch (error) {
      console.error("Error adding new card:", error);
      throw error;
    }
  }

  async createCharges(paymentDetails: PaymentChargeDetails) {
    try {
      const createCharge = await stripe.charges.create({
        receipt_email: paymentDetails.email,
        amount: Math.floor(paymentDetails.amount * 100),
        currency: paymentDetails.currency || "usd",
        customer: paymentDetails.customer_id,
        // card: card_id
      });

      return FormateData({ createCharge });
    } catch (error) {
      console.error("Error creating charge:", error);
      throw error;
    }
  }

  async getPaymentSum(payDetails: PaymentCount) {
    try {
      if (payDetails.productId) {
        const ProductPayment = await this.repository.getProductIdPaymentSum({
          productId: payDetails.productId,
        });

        return FormateData({ ProductPayment });
      } else if (payDetails.userId) {
        const ProductPayment = await this.repository.getUserIdPaymentSum({
          userId: payDetails.productId,
        });

        return FormateData({ ProductPayment });
      } else {
        const ProductPayment = await this.repository.getPaymentSum();

        return FormateData({ ProductPayment });
      }
    } catch (err) {
      console.error("Error in getProductIdPaymentSum:", err);
      // You may choose to handle or rethrow the error here
      throw err;
    }
  }

  async getCountOfPayment(criteria: string) {
    try {
      if (criteria === "month") {
        const Payment: any = await this.repository.getCountOfPaymentPerMonth();

        return FormateData({ Payment });
      } else if (criteria === "week") {
        const Payment: any = await this.repository.getCountOfPaymentPerWeek();

        return FormateData({ Payment });
      } else {
        const Payment: any = await this.repository.getCountOfPaymentPerDay();

        return FormateData({ Payment });
      }
    } catch (err: any) {
      console.log("error", err);
      throw err;
    }
  }
}

export = PaymentService;
