import { Express, Request, Response, NextFunction } from 'express';
import CategoryService from '../services/category';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/category';
import upload from '../middlewares/imageStorage';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new CategoryService();

    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         console.log(file);
    //         cb(null, './uploads'); // Define the destination folder for uploaded images
    //     },
    //     filename: (req, file, cb) => {
    //         const ext = path.extname(file.originalname);
    //         const fileName = `${Date.now()}-${Math.random()}${ext}`;
    //         cb(null, fileName);
    //     },
    // });

    // // export default { upload };
    // // Initialize Multer
    // let upload = multer({ storage: storage });

    // API = create new category
    app.post('/create-category', UserAuth, isAdmin, upload.single('image'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            console.log("req.file", req.file)
            let authUser: any = req.user
            req.body.userId = authUser._id;
            // console.log("req.body", req.body)
            const { data } = await service.CreateCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    // app.post("/upload", upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     try {
    //         // let authUser: any = req.user
    //         // req.body.userId = authUser._id;
    //         console.log("req.file", req.file)
    //         // const { data } = await service.uploadFile(req.file);
    //         return res.status(200).json({ message: "File uploaded successfully" });
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // API = get category by id and search and all category
    app.get('/get-category', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)

            const { data } = await service.getCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update category
    app.put('/update-category', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            console.log("req.body", req.body)
            const { data } = await service.updateCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete category
    app.delete('/delete-category', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const { data } = await service.deleteCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
