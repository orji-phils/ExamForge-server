"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQuestion = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/questionUploads/");
    },
    filename: (req, file, cb) => {
        // const extention = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + file.originalname);
    }
});
const filter = (req, file, cb) => {
    const extention = path_1.default.extname(file.originalname);
    if (!['.pdf', '.docx', '.doc'].includes(extention)) {
        console.log("Received file:", file.originalname, "with extension:", extention);
        return cb(new Error("Sorry! Past questions must be pdf or docs file type"));
    }
    cb(null, true);
};
exports.uploadQuestion = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: filter
});
//# sourceMappingURL=questionValidation.js.map