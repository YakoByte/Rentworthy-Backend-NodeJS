// import e from 'express';
import multer from 'multer';
import path from 'path';
// setup multer for multiple image upload and single image upload with file filter

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        cb(null, '../public/images'); // Define the destination folder for uploaded images
    },
    filename: (req: any, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random()}${ext}`;
        cb(null, fileName);
    },
});

// export default { upload };
let fileFilter = async (req: any, file: any, cb: any) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}
// Initialize Multer
let upload = multer({ storage: storage, fileFilter: fileFilter });




export default upload;

