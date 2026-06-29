"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.ExamForge_token;
    if (!token)
        return next({ status: 401, message: 'Unauthorized' });
    try {
        // decode the cookie
        const decoded = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        next({ status: 403, message: "forbidden" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map