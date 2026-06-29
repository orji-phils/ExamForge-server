"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileSchema = exports.userTokenSchema = exports.passwordSchema = exports.multiUserSchema = exports.userSchema = exports.userNameSchema = exports.userRoleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const userRoleSchema = zod_1.default
    .enum(["", "user", "admin", "master"]);
exports.userRoleSchema = userRoleSchema;
const userNameSchema = zod_1.default
    .string()
    .trim()
    .nonempty("Sorry! Please enter the user name")
    .min(4, "4 minimum user name characters allowed");
exports.userNameSchema = userNameSchema;
const userSchema = zod_1.default.object({
    id: zod_1.default
        .number()
        .optional(),
    email: zod_1.default
        .string()
        .trim()
        .email("Please enter a proper email address")
        .optional(),
    userName: userNameSchema
        .optional(),
    role: userRoleSchema
        .optional(),
    created_date: zod_1.default
        .date("Invalid created date format.")
        .optional(),
    modified_date: zod_1.default
        .date("Invalid modified date format.")
        .optional(),
    profilePicture: zod_1.default
        .string()
        .trim()
        .nullable()
        .optional()
});
exports.userSchema = userSchema;
const multiUserSchema = zod_1.default.array(userSchema);
exports.multiUserSchema = multiUserSchema;
const passwordSchema = zod_1.default.object({
    password: zod_1.default
        .string()
        .min(8, "8 minimum password characters allowed")
        .max(60)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, "At least one uppercase, lowercase, digit, and special character allowed"),
    confirmPassword: zod_1.default
        .string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match. please check the passwords and try again.",
    path: ["confirmPassword"]
});
exports.passwordSchema = passwordSchema;
const userTokenSchema = zod_1.default.object({
    userId: zod_1.default
        .number(),
    token: zod_1.default
        .string()
        .trim()
        .nonempty("Invalid or expired password reset token."),
});
exports.userTokenSchema = userTokenSchema;
const userProfileSchema = zod_1.default.object({
    id: zod_1.default
        .coerce.number()
        .optional(),
    email: zod_1.default
        .string()
        .trim()
        .email("Please enter a proper email address"),
    userName: zod_1.default
        .string()
        .trim()
        .min(4, "4 minimum user name characters allowed")
        .optional(),
    role: zod_1.default
        .enum(["admin", "master", "user"])
        .optional(),
    profilePicture: zod_1.default
        .string()
        .trim()
        .nullable()
        .optional(),
    created_date: zod_1.default
        .coerce.date("Invalid created date format.")
        .optional(),
    modified_date: zod_1.default
        .coerce.date("Invalid modified date format."),
    firstName: zod_1.default
        .string()
        .trim()
        .min(4, "4 minimum first name characters allowed.")
        .nullable(),
    lastName: zod_1.default
        .string()
        .trim()
        .min(4, "4 minimum last name characters allowed.")
        .nullable(),
    dateOfBirth: zod_1.default
        .coerce.date("Please select a valid date.")
        .nullable(),
    phoneNumber: zod_1.default
        .string()
        .trim()
        .regex(/^\d{11}$/, "Phone number must be exactly 11 digits.")
        .nullable(),
    bio: zod_1.default
        .string()
        .trim()
        .optional()
        .nullable(),
    accountNumber: zod_1.default
        .string()
        .trim()
        .regex(/^\d{10}$/, "Account number must be exactly 10 digits.")
        .optional()
        .nullable(),
    bankName: zod_1.default
        .string()
        .trim()
        .optional()
        .nullable()
});
exports.userProfileSchema = userProfileSchema;
//# sourceMappingURL=user.schema.js.map