import { Express, Request, Response, NextFunction } from 'express';
import ProductService from '../services/product';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/product';
import upload from '../middlewares/imageStorage';
import imageService from '../services/imageUpload';

export default (app: Express) => {
    const service = new ProductService();
    const image = new imageService();

    // API = create new product
    app.post('/create-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {       
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body = { ...req.body }
            if(req.body['location.coordinates']) {
                let coordinate = JSON.parse(req.body['location.coordinates'])
                delete req.body['location.coordinates']
                req.body.location = {
                    type: "Point",
                    coordinates: coordinate
                }
            }
            
            if (!req.body.isDeliverable || req.body.isDeliverable === "false") {
                delete req.body.Distance;
            }
            
            if(req.body.notAvailableDates) {
                req.body.notAvailableDates = JSON.parse(req.body.notAvailableDates);
            }
            
            delete req.body.startDate
            delete req.body.endDate

            const imageData = {
                userId: req.user._id,
                imageDetails: req.files,
            }

            req.body.images = await image.CreateImages(imageData);
            
            const data = await service.CreateProduct(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
            // next(err);
        }
    });

    app.patch('/add-noavailable-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {       
            let authUser: any = req.user
            req.body.userId = authUser._id;
            
            if(!req.body._id) {
                return res.status(400).json({ message: "_id is required" });
            }

            if(!req.body.notAvailableDates) {
                return res.status(400).json({ message: "not Available Date is required" });
            }

            req.body.notAvailableDates = JSON.parse(req.body.notAvailableDates)
            
            if(!Array.isArray(req.body.notAvailableDates)) {
                return res.status(400).json({ message: "not Available Date is not Array" });
            }

            const data = await service.AddNoAvailableDates(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
            // next(err);
        }
    });

    app.patch('/remove-noavailable-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {       
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if(!req.body._id) {
                return res.status(400).json({ message: "_id is required" });
            }

            if(!req.body.notAvailableDates) {
                return res.status(400).json({ message: "not Available Date is required" });
            }

            req.body.notAvailableDates = JSON.parse(req.body.notAvailableDates)
            
            if(!Array.isArray(req.body.notAvailableDates)) {
                return res.status(400).json({ message: "not Available Date is not Array" });
            }

            const data = await service.RemoveNoAvailableDates(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
            // next(err);
        }
    });

    app.get('/guest-product', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProduct({...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // API = get product by id and search and all product
    app.get('/get-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.query = {...req.query}
            let authUser: any = req.user
            req.query.userId = authUser._id;
            req.query.token = req.headers.authorization || '';
            req.query.roleName = authUser.roleName;

            const data = await service.getProduct({...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // API = get product by id and search and all product
    app.get('/get-admin-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.query = {...req.query}
            let authUser: any = req.user
            req.query.userId = authUser._id;
            req.query.token = req.headers.authorization || '';
            req.query.roleName = authUser.roleName;

            const data = await service.getAdminProduct({...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // API = get userData
    app.get('/get-user-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let userId;
            if(req.query.userId) {
                userId =  req.query.userId;
            } else {
                userId = req.user._id
            }

            const data = await service.getProductByUserId({ userId });
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // // API = update product
    app.put('/update-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if(req.body['location.coordinates']) {
                let coordinate = JSON.parse(req.body['location.coordinates'])
                delete req.body['location.coordinates']
                req.body.location = {
                    type: "Point",
                    coordinates: coordinate
                }
            }
            
            if (req.files.length > 0) { 
                const imageData = {
                    userId: req.user._id,
                    imageDetails: req.files,
                }
    
                req.body.images = await image.CreateImages(imageData);
            }

            if(req.body.notAvailableDates) {
                req.body.notAvailableDates = JSON.parse(req.body.notAvailableDates);
            }
            
            const data = await service.updateProduct({ ...req.body, userId: authUser._id, _id: req.query._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = admin approve product
    app.put('/approve-product', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if (req.body.isVerified === "approved" && req.body.rejectionReason) {
                delete req.body.rejectionReason;
            }

            if (req.body.isVerified === "rejected" && !req.body.rejectionReason) {
                return res.json({ message: "Rejection Reason Required" });
            }
            
            const data = await service.approveProduct({ _id: req.body._id as string, isVerified: req.body.isVerified as string, approvedBy: authUser._id, rejectionReason: req.body.rejectionReason as string });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = delete product
    app.delete('/delete-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            const data = await service.deleteProduct(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get userData
    app.get('/get-maximum-count-product', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.MaximumCountProduct();
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    //API = count views and interection   
    app.get('/get/user/product/view', UserAuth, async (req: any, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
  
        let data;
        if(req.query.userId) {
          data = await service.UserProductView(req.query.userId);
        } else {
          req.body.userId = authUser._id;
          data = await service.UserProductView(req.body.userId);
        }
  
        return res.json(data);
      } catch (err) {
        next(err);
      }
    });
  
    app.get('/get/product/view', UserAuth, async (req: any, res: Response, next: NextFunction) => {
      try {
        if(req.query.productId) {
          return res.status(404).json({error: "productId is required"})
        }
        let data = await service.ProductView(req.query.productId);
  
        return res.json(data);
      } catch (err) {
        next(err);
      }
    });
};
