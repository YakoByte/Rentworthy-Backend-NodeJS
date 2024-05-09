import { stripe } from "../utils/stripe";
import {
  GetAllPayment,
  PaymentCancel,
  PaymentChargeDetails,
  PaymentDeleteMethodDetails,
  PaymentIntendDetail,
  PaymentMethodDetails,
  PaymentTransfer,
  PaymentUpdateMethodDetails,
  PlanPricedetail,
  SubscriptionPayment,
  UpdatePayment,
} from "../interface/payment";
import paymentRepository from "../database/repository/payment";

import { FormateData, FormateError } from "../utils";
import { WEBHOOK_STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } from "../config";

class PaymentService {
  private repository: paymentRepository;

  constructor() {
    this.repository = new paymentRepository();
  }

  async StripeKey() {
    try {
      return FormateData({ STRIPE_PUBLISHABLE_KEY });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Verify the striprID" });
    }
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

        const stripeAccount = await stripe.accounts.create({
          type: "custom",
          country: "US",
          email: owner?.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: "individual",
          business_profile: {
            mcc: "1234",
            name: owner?.name,
            url: "https://rentworthy.us/",
            support_email: "support@rentworthy.us",
            support_phone: phoneNumber,
            support_url: "https://rentworthy.us/",
          },
          // metadata: { user_id: userId },
        });

        account = stripeAccount.id;

        await this.repository.VerifyAccountStripeId(account, userId);
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

        const stripeAccount = await stripe.customers.create({
          name: owner?.name,
          email: owner?.email,
          phone: phoneNumber,
          metadata: { user_id: userId },
        });

        customer = stripeAccount.id;

        await this.repository.VerifyCustomerStripeId(customer, userId);
      } else {
        customer = stripeAccount;
      }

      return FormateData({ customer });
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create Customer" });
    }
  }



  async TranserMoneyToOwner(paymentDetails: PaymentTransfer) {
    try {
      const payment = await this.repository.GetPaymentData(paymentDetails.paymentId);
      if (!payment) {
        return FormateError({ error: "No such payment found" });
      }

      if (payment.status !== 'succeeded') {
        return FormateError({ error: "You can't cancel the payment, it not yet Completed" });
      }

      const owner = await this.repository.GetOwnerData(paymentDetails.ownerId);
      if(!owner || !owner.stripAccountId) {
        return FormateError({ error: "Owner id not found" });
      }

      const cancelPayment = await stripe.paymentIntents.cancel(payment.paymentId);
      if(cancelPayment.status === 'canceled') {
        return FormateError({ error: "Payment is already Cancelled" });
      } 

      const updatePayment: UpdatePayment = {
        _id: payment._id,
        status: "Transfered To Owner",
        isDeleted: true,
      };
      await this.repository.UpdatePaymentData(updatePayment);

      await stripe.transfers.create({
        amount: payment.amount,
        currency: payment.currency || 'usd',
        destination: owner.stripAccountId,
      });

      return FormateData({ message: "Successfully Transfer Money to Owner" });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Transfer Money" });
    }
  }

  async TranserMoneyToRenter(paymentDetails: PaymentTransfer) {
    try {
      const payment = await this.repository.GetPaymentData(paymentDetails.paymentId);
      if (!payment) {
        return FormateError({ error: "No such payment found" });
      }

      if (payment.status !== 'succeeded') {
        return FormateError({ error: "You can't cancel the payment, it not yet Completed" });
      }

      const cancelPayment = await stripe.paymentIntents.cancel(payment.paymentId);
      if(cancelPayment.status === 'canceled') {
        return FormateError({ error: "Payment is already Cancelled" });
      }

      const updatePayment: UpdatePayment = {
        _id: payment._id,
        status: "Transfered To Renter",
        isDeleted: true,
      };
      await this.repository.UpdatePaymentData(updatePayment);

      await stripe.refunds.create({
        payment_intent: payment.paymentId || '',
        refund_application_fee: true,
        reverse_transfer: true,
      });

      return FormateData({ message: "Successfully Transfer Money to Renter" });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Transfer Money" });
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
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);

      let customer_Id = owner?.stripeCustomerId;

      if(!customer_Id) {
        return { message: "No Customer Found....."}
      }

      // const token = await stripe.tokens.create({
      //   card: paymentDetails.card,
      // });

      const addedCard = await stripe.customers.createSource(
        customer_Id,
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
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);

      let customer_Id = owner?.stripeCustomerId;

      if(!customer_Id) {
        return { message: "No Customer Found....."}
      }

      const addedCard = await stripe.customers.updateSource(
        customer_Id,
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
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);

      let customer_Id = owner?.stripeCustomerId;

      if(!customer_Id) {
        return { message: "No Customer Found....."}
      }

      const deleteCard = await stripe.customers.deleteSource(
        customer_Id,
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

      if(!customer_Id) {
        return { message: "No Customer Found....."}
      }

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
        
        if(!customer_Id) {
          return FormateData({ message: "Payment failed or requires a payment method!" });
        }

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
          userId: paymentDetails?.userId,
          amount: paymentDetails?.amount,
          quantity: paymentDetails?.quantity || 1,
          currency: paymentDetails.currency || "usd",
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
          userId: paymentDetails?.userId,
          amount: paymentDetails?.amount,
          quantity: paymentDetails?.quantity || 1,
          currency: paymentDetails.currency || "usd",
          status: "Additional action required for payment!",
        };

        // Payment succeeded
        let payDetails: any = await this.repository.CreatePayment(paymentData);
        return FormateData({
          message: "Payment requires_action!",
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
      const payment = await this.repository.GetPaymentData(paymentDetails.paymentId);
      if (!payment) {
        return FormateError({ error: "No such payment found" });
      }

      if (payment.status !== 'succeeded') {
        return FormateError({ error: "You can't cancel the payment, it not yet Completed" });
      }

      const cancelPayment = await stripe.paymentIntents.cancel(payment.paymentId);
      if(cancelPayment.status === 'canceled') {
        return FormateError({ error: "Payment is already Cancelled" });
      }

      const updatePayment: UpdatePayment = {
        _id: payment._id,
        status: "Cancelled",
        isDeleted: true,
      };
      await this.repository.UpdatePaymentData(updatePayment);

      await stripe.refunds.create({
        payment_intent: payment.paymentId || '',
        refund_application_fee: true,
        reverse_transfer: true,
      });

      return FormateData({ message: "Successfully Cancelled Payment" });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to Cancle Payment" });
    }
  }



  async CreatePlan(paymentDetails: PlanPricedetail) {
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

  async retrivePlan(paymentDetails: {priceId: string}) {
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



  async getPaymentSum() {
    try {
      const payment = await this.repository.getPaymentSum();

      return FormateData({ payment });
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to get payment sum" });
    }
  }

  async getCountOfPayment(criteria: string) {
    try {
      if (criteria === "month") {
        const payment: any = await this.repository.getCountOfPaymentPerMonth();

        return FormateData({ payment });
      } else if (criteria === "week") {
        const payment: any = await this.repository.getCountOfPaymentPerWeek();

        return FormateData({ payment });
      } else {
        const payment: any = await this.repository.getCountOfPaymentPerDay();

        return FormateData({ payment });
      }
    } catch (error: any) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to get payment" });
    }
  }


  
  async createChargesByCustomer(paymentDetails: PaymentChargeDetails) {
    try {
      const owner = await this.repository.GetOwnerData(paymentDetails.userId);

      let customer_Id = owner?.stripeCustomerId;

      if(!customer_Id) {
        return { message: "No Customer Found....."}
      }

      const createCharge = await stripe.charges.create({
        amount: Math.floor(paymentDetails.amount * 100),
        currency: paymentDetails.currency || "usd",
        customer: customer_Id,
        receipt_email: owner?.email,
        description: `Stripe Charge Of Amount ${paymentDetails.amount}`,
      });

      if (createCharge.status === "succeeded") {
        const paymentData = {
          paymentId: createCharge.id,
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: paymentDetails?.quantity || 1,
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
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: paymentDetails?.quantity || 1,
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
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          quantity: paymentDetails?.quantity || 1,
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
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create charge" });
    }
  }



  async StripeWebhook(payload: any, sig: any) {
    try {
      let event;
      if (!sig) {
        return FormateError({ error: 'Stripe Webhook Error: stripe-signature was found to be empty' });
      }
  
      if (!WEBHOOK_STRIPE_SECRET_KEY) {
        return FormateError({ error: 'Stripe Webhook Error: WEBHOOK_STRIPE_SECRET_KEY was found to be empty' });
      }
  
      try {
        event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_STRIPE_SECRET_KEY);
      } catch (err: any) {
        return FormateError({ error: `Stripe Webhook Error in constructEvent: ${err.message}` });
      }
  
      if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
        const stripeData: any = event.data.object;
        try {
          const userDetail = await this.repository.getAccountDetail(stripeData.customer);
          const paymentData = {
            paymentId: stripeData.id,
            userId: userDetail?._id,
            amount: stripeData?.amount,
            quantity: 1,
            currency: stripeData.currency || "usd",
            status: "succeeded",
          };
  
          // Payment succeeded
          await this.repository.CreatePayment(paymentData);
        } catch (err: any) {
          return FormateError({ error: `Stripe Webhook Order Completion error: ${err.message}` });
        }
      }
  
      return true;
    } catch (error) {
      console.log("error: ", error);
      return FormateError({ error: "Failed to create charge" });
    }
  }

  async GetAllPayment(bookingInputs: GetAllPayment) {
    try {
        let payments: any = await this.repository.GetAllPayment(bookingInputs);

        return FormateData(payments);
    } catch (err: any) {
        return FormateError({ error: "Failed to Get Booking" });
    }
}
}

export = PaymentService;
