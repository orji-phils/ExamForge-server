"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerErrorHandler = exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const createLogs_1 = require("../service/utility/createLogs");
const errorHandler = async (err, req, res, next) => {
    const defaultMessage = "We're having technical issues. Please try again later";
    const { status, message, type, severity, error } = err;
    console.log("The error data is:", err);
    try {
        // log system error 
        await (0, createLogs_1.systemLog)({
            type: type || "server",
            severity: severity || "medium",
            message: message || "Unhandled server error",
            endpoint: req.originalUrl,
            method: req.method,
            stack: error?.stack || err.stack,
            user: req.user?.id || null
        });
    }
    catch (error) {
        console.log("Error logging system error:", error);
    }
    // send client response
    res.status(status || 500).json({ message: message || defaultMessage });
};
exports.errorHandler = errorHandler;
const multerErrorHandler = (err, req, res, next) => {
    let status = 400;
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(status).json({ message: "File too large. File size must not exceed 5mb." });
        }
    }
    next();
};
exports.multerErrorHandler = multerErrorHandler;
//# sourceMappingURL=errors.middleware.js.map