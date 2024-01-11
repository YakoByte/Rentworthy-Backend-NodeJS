import SubscriptionRepository from '../database/repository/subscription';
import { FormateData } from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

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
            console.log("SubscriptionInputs", SubscriptionInputs)
            const existingSubscription: any = await this.repository.CreateSubscription(
                SubscriptionInputs
            );

            return FormateData({ existingSubscription });
        } catch (err: any) {
            console.log("err", err.message)
            return ({ message: "Data Not found", err });
        }
    }
    // get Subscriptions by id
    async getSubscriptionById(SubscriptionInputs: subscriptionGetRequest) {
        try {
            let existingSubscriptions = await this.repository.getSubscriptionById(
                SubscriptionInputs
            );

            return FormateData({ existingSubscriptions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get All Subscriptions
    async getAllSubscription(SubscriptionInputs: subscriptionGetRequest) {
        try {
            let existingSubscriptions: any
            existingSubscriptions = await this.repository.getAllSubscription();

            return FormateData({ existingSubscriptions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // get Subscriptions by id
    async getSubscription(SubscriptionInputs: subscriptionGetRequest) {
        try {
            let existingSubscriptions: any
            existingSubscriptions = await this.repository.getSubscription(
                SubscriptionInputs
            );

            return FormateData({ existingSubscriptions });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // update Subscription by id
    async updateById(SubscriptionInputs: subscriptionUpdateRequest) {
        try {
            const existingSubscription: any = await this.repository.updateSubscriptionById(
                SubscriptionInputs
            );

            return FormateData({ existingSubscription });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    // delete Subscription by id  (soft delete)
    async deleteSubscription(SubscriptionInputs: subscriptionDeleteRequest) {
        try {
            const existingSubscription: any = await this.repository.deleteSubscriptionById(
                SubscriptionInputs
            );

            return FormateData({ existingSubscription });
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }

}

export = SubscriptionService;
