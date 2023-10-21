"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("../services/admin"));
const auth_1 = __importDefault(require("../middlewares/auth"));
// interface AuthenticatedRequest extends Request {
//   user?: {
//     _id: string;
//   };
// }
exports.default = (app) => {
    const service = new admin_1.default();
    app.post('/admin/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, userName, password, phoneNo } = req.body;
            const { data } = yield service.SignUp(req.body);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/admin/create-user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, userName, password, phoneNo } = req.body;
            const { data } = yield service.SignUp({ email, userName, password, phoneNo });
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/admin/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { data } = yield service.SignIn({ email, password });
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    }));
    // app.post('/admin/address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //   try {
    //     const { _id } = req.user!;
    //     const userId = _id;
    //     const { address1, address2, city, state, postalCode, country } = req.body;
    //     const { data } = await service.AddNewAddress({
    //       userId,
    //       address1,
    //       address2,
    //       city,
    //       state,
    //       postalCode,
    //       country,
    //     });
    //     return res.json(data);
    //   } catch (err) {
    //     next(err);
    //   }
    // });
    app.get('/admin/profile', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { data } = yield service.GetProfile(_id);
            return res.json(data);
        }
        catch (err) {
            next(err);
        }
    }));
};
