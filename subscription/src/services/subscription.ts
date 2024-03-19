import SubscriptionRepository from '../database/repository/subscription';
import { FormateData, FormateError } from '../utils';

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
            const existingSubscription: any = await this.repository.CreateSubscription(
                SubscriptionInputs
            );

            return FormateData(existingSubscription);
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
            }
            else if(SubscriptionInputs.timelimit) {
                existingSubscriptions = await this.repository.getSubscriptionByTimeLimit(SubscriptionInputs)
            }
            else {
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
    async updateById(SubscriptionInputs: subscriptionUpdateRequest) {
        try {
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
