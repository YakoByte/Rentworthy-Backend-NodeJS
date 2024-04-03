import { stripe } from "../utils/stripe";
import {
  PaymentCancel,
  PaymentChargeDetails,
  PaymentCount,
  PaymentDeleteMethodDetails,
  PaymentIntendDetail,
  PaymentMethodDetails,
  PaymentUpdateMethodDetails,
  PlanProductPricedetail,
  SubscriptionPayment,
  UpdatePayment,
} from "../interface/payment";
import paymentRepository from "../database/repository/payment";

import { FormateData, FormateError } from "../utils";

class PaymentService {
  private repository: paymentRepository;

  constructor() {
    this.repository = new paymentRepository();
  }

  async VerifyAccountStripeId(stripeId: string, userId: string) {
    try {
      const account = await stripe.accounts.retrieve(stripeId);

      if (account) {
        await this.repository.VerifyAccountStripeId(stripeId, userId);
      }

      return FormateData({ account });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Verify the striprID" });
    }
  }

  async VerifyCustomerStripeId(stripeId: string, userId: string) {
    try {
      const customer = await stripe.customers.retrieve(stripeId);

      if (customer) {
        await this.repository.VerifyCustomerStripeId(stripeId, userId);
      }

      return FormateData({ customer });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Verify the striprID" });
    }
  }

  async createAccount(userId: string) {
    try {
      const owner = await this.repository.GetOwnerData(userId);

      let stripeAccount = owner?.stripAccountId;
      let account;
      
      if (!stripeAccount) {
        const phoneNumber = `+${owner?.phoneCode}-${owner?.phoneNo}`;

        account = await stripe.accounts.create({
          country: "US",
          type: "custom",
          email: owner?.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: "individual",
          // business_profile: {
          //   url: "https://rentworthy.us/",
          //   mcc: "7394",
          //   support_email: "support@rentworthy.us",
          // },
          company: { phone: phoneNumber },
          metadata: { user_id: userId },
        });

        stripeAccount = account.id;

        await this.repository.VerifyAccountStripeId(stripeAccount, userId);
      } else {
        account = stripeAccount;
      }

      // const accountLinksResult = await stripe.accountLinks.create({
      //   account: stripeAccount,
      //   refresh_url: "https://rentworthy.us/account",
      //   return_url: `https://rentworthy.us/account/verify/account/${stripeAccount}`,
      //   type: "account_update",
      //   collect: "currently_due",
      // });

      return FormateData({ account });
    } catch (error: any) {
      console.error("Error:", error);
      return FormateError({ error: "Failed to create Account" });
    }
  }

  async createCustomer(userId: string) {
    try {
      const owner = await this.repository.GetOwnerData(userId);      

      let stripeAccount = owner?.stripeCustomerId;
      let customer;

      if (!stripeAccount) {
        const phoneNumber = `+${owner?.phoneCode || '91'}-${owner?.phoneNo}`;        

        customer = await stripe.customers.create({
          name: owner?.name,
          email: owner?.email,
          phone: phoneNumber,
          metadata: { user_id: userId },
        });

        stripeAccount = customer.id;

        await this.repository.VerifyCustomerStripeId(stripeAccount, userId);
      } else {
        customer = stripeAccount;
      }

      // const accountLinksResult = await stripe.accountLinks.create({
      //   account: stripeAccount,
      //   refresh_url: "https://rentworthy.us/account",
      //   return_url: `https://rentworthy.us/account/verify/account/${stripeAccount}`,
      //   type: "account_update",
      //   collect: "currently_due",
      // });

      return FormateData({ customer });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create Customer" });
    }
  }

  async CreateToken(paymentDetails: PaymentMethodDetails) {
    try {
      const token = await stripe.tokens.create({
        card: paymentDetails.card,
      });

      return FormateData({ token });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to add new Card" });
    }
  }

  async addNewCard(paymentDetails: PaymentMethodDetails) {
    try {
      // const token = await stripe.tokens.create({
      //   card: paymentDetails.card,
      // });

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

  async updateCard(paymentDetails: PaymentUpdateMethodDetails) {
    try {
      const addedCard = await stripe.customers.updateSource(
        paymentDetails.customer_id,
        paymentDetails.card_Id,
        {
          name: paymentDetails.name,
          exp_month: paymentDetails.exp_month,
          exp_year: paymentDetails.exp_year,
        }
      );

      return FormateData({ card: addedCard });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to update new Card" });
    }
  }

  async deleteCard(paymentDetails: PaymentDeleteMethodDetails) {
    try {
      const deleteCard = await stripe.customers.deleteSource(
        paymentDetails.customer_id,
        paymentDetails.card_Id
      );

      return FormateData({ card: deleteCard });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Delete new Card" });
    }
  }

  async listPaymentCard(userId: string) {
    try {
      const owner = await this.repository.GetOwnerData(userId);

      let customer_Id = owner?.stripeCustomerId;

      const Cards = await stripe.paymentMethods.list({
        customer: customer_Id,
        type: "card",
      });

      return FormateData({ Cards });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to list Cards" });
    }
  }

  async createPayment(paymentDetails: PaymentIntendDetail) {
    try {
      let owner = await this.repository.GetOwnerData(paymentDetails.userId);    
      let booking = await this.repository.getBooking(paymentDetails.bookingId);  

      let paymentMethod;
      if(paymentDetails.card) {
        // const token = await stripe.tokens.create({
        //   card: paymentDetails.card,
        // });

        paymentMethod = await stripe.customers.createSource(
          owner?.stripeCustomerId || '',
          { source: "tok_visa"} // source: token.id 
        );
      } else {
        let customer_Id = owner?.stripeCustomerId;        

        const Cards = await stripe.paymentMethods.list({
          customer: customer_Id,
          type: "card",
        });

        paymentMethod = Cards?.data[0]
      }      

      let customer;
      if (owner?.stripeCustomerId === null || owner?.stripeCustomerId === undefined) {
        customer = await stripe.customers.create({
          name: paymentDetails.name,
          email: paymentDetails.email,
        });
      }

      const payment = await stripe.paymentIntents.create({
        amount: Math.floor(paymentDetails.amount * 100),
        receipt_email: owner?.email,
        customer: owner?.stripeCustomerId || customer?.id,
        payment_method: paymentMethod.id,
        currency: paymentDetails.currency,
        metadata: {
          integration_check: "accept_a_payment",
        },
        capture_method: "manual",
        payment_method_types: ["card"],
        confirm: true,
      });

      if (payment.status === "succeeded") {
        const paymentData = {
          paymentId: payment.id,
          bookingId: booking._id,
          productId: booking.productId.toString(),
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: booking.quantity || 1,
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
        const paymentData = {
          paymentId: payment.id,
          bookingId: booking._id,
          productId: booking.productId.toString(),
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: booking.quantity || 1,
          currency: paymentDetails.currency,
          status: "Additional action required for payment!",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Payment succeeded!",
          payStatus: payment.status,
          paymentData: payDetails,
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

  async retrivePaymentStatus(paymentId: string, userId: string) {
    try {
      const status = await stripe.paymentIntents.retrieve(paymentId);
      if (status) {
        await this.repository.GetOwnerData(userId);
      }
      return FormateData({ status });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to retrive payment Id" });
    }
  }

  async CancelPayment(paymentDetails: PaymentCancel) {
    try {
      const payment = await this.repository.GetPaymentData(
        paymentDetails.userId,
        paymentDetails.bookingId
      );
      if (!payment) {
        throw new Error("No such payment found");
      }      

      const createCancel = await stripe.paymentIntents.cancel(
        payment?.paymentId
      );

      const updatePayment: UpdatePayment = {
        _id: payment._id,
        status: "Cancelled",
        isDeleted: true,
      };
      await this.repository.UpdatePaymentData(updatePayment);

      const refundResult = await stripe.refunds.create({
        payment_intent: payment.paymentId || '',
        refund_application_fee: true,
        reverse_transfer: true,
      });

      return FormateData({ createCancel, refundResult });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Cancle Payment" });
    }
  }

  async CreatePlanProduct(paymentDetails: PlanProductPricedetail) {
    try {
      const price = await stripe.prices.create({
        currency: paymentDetails.currency,
        unit_amount: paymentDetails.amount,
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: paymentDetails.planType,
        },
      });

      return FormateData({ price });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to subcription Payment" });
    }
  }

  async retrivePlanProduct(paymentDetails: {priceId: string}) {
    try {
      const price = await stripe.prices.retrieve(paymentDetails.priceId);

      return FormateData({ price });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to subcription Payment" });
    }
  }

  async SubscriptionPayment(paymentDetails: SubscriptionPayment) {
    try {
      const price = await stripe.prices.retrieve(paymentDetails.stripePriceId);
      if(!price) {
        throw new Error('Invalid Price Id');
      }

      const subscription = await stripe.subscriptions.create({
        customer: paymentDetails.customerId,
        items: [
          {
            price: paymentDetails.stripePriceId,
          },
        ],
      });

      if(subscription) {
        const paymentData = {
          paymentId: subscription.id,
          bookingId: paymentDetails.bookingId,
          productId: paymentDetails.productId,
          userId: paymentDetails.userId,
          amount:  price.unit_amount || 0,
          quantity: 1,
          currency: price.currency || 'usd',
          status: "succeeded",
        };

        await this.repository.CreatePayment(paymentData);
      }
      return FormateData({ subscription });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to subcription Payment" });
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


  
  async createChargesByCustomer(paymentDetails: PaymentChargeDetails) {
    try {
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);
      let booking = await this.repository.getBooking(paymentDetails.bookingId);  

      const createCharge = await stripe.charges.create({
        amount: Math.floor(paymentDetails.amount * 100),
        currency: paymentDetails.currency || "usd",
        customer: paymentDetails.customer_id,
        receipt_email: owner?.email,
        description: `Stripe Charge Of Amount ${paymentDetails.amount}`,
      });

      if (createCharge.status === "succeeded") {
        const paymentData = {
          paymentId: createCharge.id,
          bookingId: booking._id,
          productId: booking.productId.toString(),
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: booking.quantity || 1,
          currency: paymentDetails.currency || "usd",
          status: "succeeded",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Payment succeeded!",
          payStatus: createCharge.status,
          paymentData: payDetails,
          stripeData: createCharge,
        });
      } else if (createCharge.status === "pending") {
        return FormateData({
          message: "Additional action required for payment!",
          payStatus: createCharge.status,
          stripeData: createCharge,
        });
      } else {
        return FormateData({
          message: "Payment failed or requires a different payment method!",
          payStatus: createCharge.status,
        });
      }

      return FormateData({ createCharge });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create charge" });
    }
  }

  async createChargesByToken(paymentDetails: PaymentChargeDetails) {
    try {
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);
      let booking = await this.repository.getBooking(paymentDetails.bookingId);  

      const createCharge = await stripe.charges.create({
        amount: Math.floor(paymentDetails.amount * 100),
        currency: paymentDetails.currency || "usd",
        source: paymentDetails.token_id,
        receipt_email: owner?.email,
        description: `Stripe Charge Of Amount ${paymentDetails.amount}`,
      });

      if (createCharge.status === "succeeded") {
        const paymentData = {
          paymentId: createCharge.id,
          bookingId: booking._id,
          productId: booking.productId.toString(),
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: booking.quantity || 1,
          currency: paymentDetails.currency || "usd",
          status: "succeeded",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Payment succeeded!",
          payStatus: createCharge.status,
          paymentData: payDetails,
          stripeData: createCharge,
        });
      } else if (createCharge.status === "pending") {
        const paymentData = {
          paymentId: createCharge.id,
          bookingId: booking._id,
          productId: booking.productId.toString(),
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: booking.quantity || 1,
          currency: paymentDetails.currency || "usd",
          status: "succeeded",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Additional action required for payment!",
          payStatus: createCharge.status,
          paymentData: payDetails,
          stripeData: createCharge,
        });
      } else {
        return FormateData({
          message: "Payment failed or requires a different payment method!",
          payStatus: createCharge.status,
        });
      }

      return FormateData({ createCharge });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create charge" });
    }
  }
}

export = PaymentService;
