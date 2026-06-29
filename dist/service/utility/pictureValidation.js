"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/profileUploads/");
    },
    filename: (req, file, cb) => {
        const name = Date.now() + Math.round(Math.random() * 1E9);
        const extention = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + name + extention);
    }
});
const filter = (req, file, cb) => {
    const extention = path_1.default.extname(file.originalname).toLowerCase();
    if (!['.jpg', 'jpeg', '.gif', '.png', '.webp'].includes(extention)) {
        return cb(new Error("Sorry! Only gif, jpg, jpeg, png and webp files are allowed for profile pictures"));
    }
    cb(null, true);
};
exports.uploadProfile = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: filter
});
//# sourceMappingURL=pictureValidation.js.map