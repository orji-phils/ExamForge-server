import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/questionUploads/");
    },
    filename: (req, file, cb) => {
        const extention = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + file.originalname);
    }
});

const filter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const extention = path.extname(file.originalname);
    if (!['.pdf', '.docx', '.doc'].includes(extention)) {
        console.log("Received file:", file.originalname, "with extension:", extention);
        return cb(new Error("Sorry! Past questions must be pdf or docs file type"));
    }
    cb(null, true);
}

export const uploadQuestion = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: filter
});