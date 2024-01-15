"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import e from 'express';
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// setup multer for multiple image upload and single image upload with file filter
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/images'); // Define the destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random()}${ext}`;
        cb(null, fileName);
    },
});
// export default { upload };
let fileFilter = async (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb('Error: Images Only!');
    }
};
// Initialize Multer
let upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
exports.default = upload;
