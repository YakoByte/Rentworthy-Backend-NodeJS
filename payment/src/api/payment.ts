import PaymentService from '../services/payment';
import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, getCountAuthenticatedRequest } from '../interface/payment';


export default (app: Express) => {
    const service = new PaymentService();

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

    // API = retirve payment status
    app.get('/retrive-payment-status', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            let stripeId: any = req.query.stripeId;
            const data = await service.retrivePaymentStatus(stripeId, userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = create account
    app.post('/create-account', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            const data = await service.createAccount(userId);
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

    app.post('/payment-intent-create', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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