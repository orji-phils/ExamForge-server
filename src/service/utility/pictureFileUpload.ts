import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/profileUploads/");
  },
  filename: (req, file, cb) => {
    const name = Date.now() + Math.round(Math.random() * 1E9);
    const extention = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + name + extention);
  }
});

const filter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const extention = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', 'jpeg', '.gif', '.png', '.webp'].includes(extention)) {
      return cb(new Error("Sorry! Only gif, jpg, jpeg, png and webp files are allowed for profile pictures"));
    }
    cb(null, true);
  }

export const uploadProfile = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: filter
});