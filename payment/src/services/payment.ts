import { stripe } from "../utils/stripe";
import {
  PaymentCancel,
  PaymentChargeDetails,
  PaymentCount,
  PaymentIntendDetail,
  PaymentMethodDetails,
  UpdatePayment,
} from "../interface/payment";
import paymentRepository from "../database/repository/payment";

import { FormateData, FormateError } from "../utils";
import { VENDOR_STRIPE_ACCOUNT_ID } from "../config";

class PaymentService {
  private repository: paymentRepository;

  constructor() {
    this.repository = new paymentRepository();
  }

  async VerifyStripeId(stripeId: string, userId: string) {
    try {
      const customer = await stripe.accounts.retrieve(stripeId);

      if (customer) {
        await this.repository.VerifyStripeId(stripeId, userId);
      }

      return FormateData({ customer });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Verify the striprID" });
    }
  }

  async retrivePaymentStatus(stripeId: string, userId: string) {
    try {
      const status = await stripe.paymentIntents.retrieve(stripeId);
      if (status) {
        await this.repository.GetOwnerData(userId);
      }
      return FormateData({ status });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to retrive payment Id" });
    }
  }

  async createAccount(userId: string) {
    try {
      const owner = await this.repository.GetOwnerData(userId);

      let stripeAccount = owner?.stripeId;

      if (!stripeAccount) {
        const phoneNumber = `+${owner?.phoneCode}-${owner?.phoneNo}`;

        const customer = await stripe.accounts.create({
          country: "US",
          type: "custom",
          email: owner?.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: "individual",
          business_profile: {
            url: "https://rentworthy.us/",
            mcc: "7394",
            support_email: "support@rentworthy.us",
          },
          company: { phone: phoneNumber },
          metadata: { user_id: userId },
        });

        stripeAccount = customer.id;

        await this.repository.VerifyStripeId(stripeAccount, userId);
      }

      const accountLinksResult = await stripe.accountLinks.create({
        account: stripeAccount,
        refresh_url: "https://rentworthy.us/account",
        return_url: `https://rentworthy.us/account/verify/account/${stripeAccount}`,
        type: "account_update",
        collect: "currently_due",
      });

      return FormateData({ accountLinksResult, owner });
    } catch (error: any) {
      console.error("Error:", error);
      return FormateError({ error: "Failed to create Customer" });
    }
  }

  async createCustomer(name: string, email: string) {
    try {
      const customer = await stripe.customers.create({
        name: name,
        email: email,
      });

      return FormateData(customer);
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create Customer" });
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
          source: "tok_visa",
          // source: token.id,
        }
      );

      return FormateData({ card: addedCard });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to add new Card" });
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
      console.log("error: ", error);
      return FormateError({ error: "Failed to create charge" });
    }
  }

  async paymentIntentPayment(paymentDetails: PaymentIntendDetail) {
    try {
      // const token = await stripe.tokens.create({
      //   card: paymentDetails.card,
      // });

      // const paymentMethod = await stripe.paymentMethods.create({
      //   type: "card",
      //   card: paymentDetails.card
      // });

      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          token: "tok_visa",
        },
      });

      let customer;
      if (
        paymentDetails.stripeId === null ||
        paymentDetails.stripeId === undefined
      ) {
        customer = await stripe.customers.create({
          name: paymentDetails.name,
          email: paymentDetails.email,
        });
      }

      const payment = await stripe.paymentIntents.create({
        receipt_email: paymentDetails.email,
        customer: paymentDetails.stripeId || customer?.id,
        payment_method: paymentMethod.id,
        amount: Math.floor(paymentDetails.amount * 100),
        currency: paymentDetails.currency,
        metadata: {
          integration_check: "accept_a_payment",
        },
        capture_method: "manual",
        payment_method_types: ["card"],
        confirm: true,
        transfer_data: {
          destination: VENDOR_STRIPE_ACCOUNT_ID || "",
        },
      });

      if (payment.status === "succeeded") {
        const paymentData = {
          paymentId: payment.id,
          productId: paymentDetails.productId,
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: paymentDetails.quantity,
          currency: paymentDetails.currency,
          status: "succeeded",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Payment succeeded!",
          payStatus: payment.status,
          paymentData: payDetails,
          stripeData: payment,
        });
      } else if (payment.status === "requires_action") {
        return FormateData({
          message: "Additional action required for payment!",
          payStatus: payment.status,
          stripeData: payment,
        });
      } else {
        return FormateData({
          message: "Payment failed or requires a different payment method!",
          payStatus: payment.status,
        });
      }

      return FormateData({ error: "Payment Failed" });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create Payment" });
    }
  }

  async CancelPayment(paymentDetails: PaymentCancel) {
    try {
      const payment = await this.repository.GetPaymentData(
        paymentDetails.userId,
        paymentDetails.stripId
      );
      if (!payment) {
        throw new Error("No such payment found");
      }

      const createCharge = await stripe.paymentIntents.cancel(
        paymentDetails.stripId
      );

      const updatePayment: UpdatePayment = {
        _id: payment._id,
        status: "Canceled",
        isDeleted: true,
      };
      await this.repository.UpdatePaymentData(updatePayment);

      const refundResult = await stripe.refunds.create({
        payment_intent: paymentDetails.stripId,
        refund_application_fee: true,
        reverse_transfer: true,
      });

      return FormateData({ createCharge, refundResult });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Cancle Payment" });
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
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to get payment sum" });
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
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to get payment" });
    }
  }
}

export = PaymentService;
