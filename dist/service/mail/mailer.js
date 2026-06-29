"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    }
});
const mailer = async (recipient, subject, body) => {
    return await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: recipient,
        subject,
        html: body,
    });
};
exports.mailer = mailer;
//# sourceMappingURL=mailer.js.map