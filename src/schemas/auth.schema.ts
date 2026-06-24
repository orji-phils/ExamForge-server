import { z } from "zod";

const signupSchema = z.object({
    email: z
    .string()
    .trim()
    .email("Please enter a proper email address"),

    userName: z
    .string()
    .trim()
    .min(4, "4 minimum user name characters allowed"),

    password: z
    .string()
    .min(8, "8 minimum password characters allowed")
    .max(60)
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "At least one uppercase, lowercase, digit, and special character allowed"
    ),
    confirmPassword: z
    .string()
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

const signinSchema = z.object({
    userName: z
    .string()
    .trim(),

    password: z
    .string()
})

export { signupSchema, signinSchema };