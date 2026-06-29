"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const profileSchema = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .trim()
        .min(4, "4 minimum first name characters allowed."),
    lastName: zod_1.default
        .string()
        .trim()
        .min(4, "4 minimum last name characters allowed."),
    userName: zod_1.default
        .string()
        .optional(),
    dateOfBirth: zod_1.default
        .coerce.date("Please select a valid date."),
    phoneNumber: zod_1.default
        .string()
        .trim()
        .regex(/^\d{11}$/, "Phone number must be exactly 11 digits."),
    bio: zod_1.default
        .string()
        .trim()
        .optional(),
    accountNumber: zod_1.default
        .string()
        .trim()
        .regex(/^\d{10}$/, "Account number must be exactly 10 digits.")
        .optional(),
    bankName: zod_1.default
        .string()
        .trim()
        .optional()
});
exports.profileSchema = profileSchema;
//# sourceMappingURL=profile.schema.js.map