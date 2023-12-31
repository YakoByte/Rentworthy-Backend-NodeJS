import PaymentService from '../services/payment';
import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { postAuthenticatedRequest, confirmIntentRequest } from '../interface/payment';


export default (app: Express) => {
    const service = new PaymentService();

    // API = create new payment intent
    app.post('/create-payment-intent', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            console.log("req.body", req.body)
            const data = await service.createPaymentIntent(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/confirm-payment-intent', UserAuth, async (req: confirmIntentRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.confirmPaymentIntent(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = verify stripe Id
    app.get('/verify-stripe-id/:stripeId', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.VerifyStripeId(req.params.stripeId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = create test customer
    app.post('/create-test-customer', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.createTestCustomer();
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};