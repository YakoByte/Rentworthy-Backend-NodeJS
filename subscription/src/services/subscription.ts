import SubscriptionRepository from '../database/repository/subscription';
import { FormateData, FormateError } from '../utils';
import { stripe } from '../utils/stripe';
import { subscriptionRequest, subscriptionUpdateRequest, subscriptionGetRequest, subscriptionDeleteRequest } from '../interface/subscription';

// All Business logic will be here
class SubscriptionService {
    private repository: SubscriptionRepository;

    constructor() {
        this.repository = new SubscriptionRepository();
    }
    // create Subscription
    async CreateSubscription(SubscriptionInputs: subscriptionRequest) {
        try {
            const Subscription: any = await this.repository.CreateSubscription(SubscriptionInputs);

            const plan = await stripe.prices.create({
                currency: Subscription.currency || 'USD',
                unit_amount: Subscription.price,
                recurring: {
                  interval: Subscription.timelimit,
                },
                product_data: {
                  name: `${Subscription.title}-${Subscription._id}`,
                },
            });

            if(!plan) {
                await this.repository.deleteSubscriptionById({_id: Subscription._id});
                return FormateError({ error: "Plan not created" })
            }

            await this.repository.updateSubscriptionById({_id: Subscription._id, planId: plan.id })

            return FormateData(Subscription);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create Subscription" });
        }
    }

    // get Subscriptions by id
    async getSubscription(SubscriptionInputs: subscriptionGetRequest) {
        try {
            let existingSubscriptions: any
            if(SubscriptionInputs._id) {
                existingSubscriptions = await this.repository.getSubscriptionById(SubscriptionInputs)
            } else if(SubscriptionInputs.title) {
                existingSubscriptions = await this.repository.getSubscriptionByTitle(SubscriptionInputs)
            } else if(SubscriptionInputs.points) {
                existingSubscriptions = await this.repository.getSubscriptionByPoint(SubscriptionInputs)
            } else if(SubscriptionInputs.price) {
                existingSubscriptions = await this.repository.getSubscriptionByPrice(SubscriptionInputs)
            } else if(SubscriptionInputs.currency) {
                existingSubscriptions = await this.repository.getSubscriptionByCurrency(SubscriptionInputs)
            } else if(SubscriptionInputs.timelimit) {
                existingSubscriptions = await this.repository.getSubscriptionByTimeLimit(SubscriptionInputs)
            } else {
                existingSubscriptions = await this.repository.getAllSubscription({
                    skip:
                      Number(SubscriptionInputs.page) * Number(SubscriptionInputs.limit) -
                        Number(SubscriptionInputs.limit) || 0,
                    limit: Number(SubscriptionInputs.limit) || 10,
                })
            }

            return FormateData(existingSubscriptions);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Subscription" });
        }
    }

    // update Subscription by id
    async updateSubscriptionById(SubscriptionInputs: subscriptionUpdateRequest) {
        try {
            const existingSubscriptions: any = await this.repository.getSubscriptionPlanById(SubscriptionInputs._id);
            if(!existingSubscriptions) {
                return FormateError({ error: "Subscription not Found" })   
            }

            if(SubscriptionInputs.price) {
                const plan = await stripe.prices.create({
                    currency: existingSubscriptions.currency || 'USD',
                    unit_amount: existingSubscriptions.price,
                    recurring: {
                      interval: existingSubscriptions.timelimit,
                    },
                    product_data: {
                      name: `${existingSubscriptions.title}-${existingSubscriptions.title}`,
                    },
                });

                if(!plan) {
                    return FormateError({ error: "Plan not created" })   
                }

                SubscriptionInputs.planId = plan.id;
            }

            const existingSubscription: any = await this.repository.updateSubscriptionById(
                SubscriptionInputs
            );

            return FormateData(existingSubscription);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Subscription" });
        }
    }

    // delete Subscription by id  (soft delete)
    async deleteSubscription(SubscriptionInputs: subscriptionDeleteRequest) {
        try {
            const existingSubscription: any = await this.repository.deleteSubscriptionById(
                SubscriptionInputs
            );

            return FormateData(existingSubscription);
        } catch (err: any) {
            return FormateError({ error: "Failed to delete Subscription" });
        }
    }
}

export = SubscriptionService;
