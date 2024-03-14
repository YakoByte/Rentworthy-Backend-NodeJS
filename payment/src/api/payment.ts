import PaymentService from '../services/payment';
import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, getCountAuthenticatedRequest } from '../interface/payment';


export default (app: Express) => {
    const service = new PaymentService();

    // API = verify account stripe Id
    app.get('/verify-account-stripe-id', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            let stripeId: any = req.query.stripeId;
            const data = await service.VerifyAccountStripeId(stripeId, userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    
    // API = verify account stripe Id
    app.get('/verify-customer-stripe-id', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            let stripeId: any = req.query.stripeId;
            const data = await service.VerifyCustomerStripeId(stripeId, userId);
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
    app.post('/create-customer', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            const data = await service.createCustomer(userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = create Token
    app.post('/token', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            const data = await service.CreateToken(userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = add card
    app.post('/add-card', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.addNewCard(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update card
    app.put('/update-card', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateCard(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete card
    app.delete('/delete-card', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.deleteCard(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get all card
    app.get('/get-all-card', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            const data = await service.listPaymentCard(userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-charge-customer', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.createChargesByCustomer(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-charge-token', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.createChargesByToken(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/payment-intent-create', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.createPayment(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/retrive-payment-status', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId:any = req.user?._id
            let paymentId: any = req.query.paymentId;
            const data = await service.retrivePaymentStatus(paymentId, userId);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/payment-intent-cancel', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.CancelPayment(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-plan-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.CreatePlanProduct(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/retrive-plan-product', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            let priceId = req.query.price as string || '';
            
            if (priceId === '') {
                res.status(401).json({ error: 'Missing parameter' })
            }

            const data = await service.retrivePlanProduct({priceId});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-subscription-plan', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser:any = req.user?._id;
            req.body.userId = authUser;
            const data = await service.SubscriptionPayment(req.body);
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