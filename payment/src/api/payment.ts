import PaymentService from '../services/payment';
import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { postAuthenticatedRequest, confirmIntentRequest, AuthenticatedRequest, getCountAuthenticatedRequest } from '../interface/payment';


export default (app: Express) => {
    const service = new PaymentService();

    // API = create new payment intent
    app.post('/create-payment-intent', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
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

    app.post('/transfer-payment', UserAuth, async (req: confirmIntentRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.PaymentTransfer(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    })

    // API = verify stripe Id
    app.get('/verify-stripe-id', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            let stripeId: any = req.query.stripeId;
            const data = await service.VerifyStripeId(stripeId, userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = create customer
    app.post('/create-customer', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.createCustomer(req.body.name, req.body.email);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/add-card', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.addNewCard(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-charge', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.createCharges(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/payment-intent-payment/create', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.paymentIntentPayment(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/payment-intent-payment/cancel', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.CancelPayment(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/get-payment-sum', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.query.productId?.toString() || '';
            const userId = req.query.userId?.toString() || '';
            const data = await service.getPaymentSum({ productId: productId, userId: userId });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = count payment by every minutes   
    app.get('/get-payment-booking/statiscs', UserAuth, async (req: getCountAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            let criteria = req.query.criteria
            const data = await service.getCountOfPayment(criteria);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};