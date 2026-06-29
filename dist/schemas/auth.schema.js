"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email("Please enter a proper email address"),
    userName: zod_1.z
        .string()
        .trim()
        .min(4, "4 minimum user name characters allowed"),
    password: zod_1.z
        .string()
        .min(8, "8 minimum password characters allowed")
        .max(60)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, "At least one uppercase, lowercase, digit, and special character allowed"),
    confirmPassword: zod_1.z
        .string()
})
    .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});
exports.signupSchema = signupSchema;
const signinSchema = zod_1.z.object({
    userName: zod_1.z
        .string()
        .trim(),
    password: zod_1.z
        .string()
});
exports.signinSchema = signinSchema;
//# sourceMappingURL=auth.schema.js.map