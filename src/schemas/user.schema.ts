import { RowDataPacket } from "mysql2";
import z from "zod";

const userRoleSchema = z
.enum(["", "user", "admin", "master"])

const userNameSchema = z
.string()
.trim()
.nonempty("Sorry! Please enter the user name")
.min(4, "4 minimum user name characters allowed")

const userSchema = z.object({
    id: z
    .number()
    .optional(),

    email: z
    .string()
    .trim()
    .email("Please enter a proper email address")
    .optional(),

    userName: userNameSchema
    .optional(),

    role: userRoleSchema
    .optional(),

    created_date: z
    .date("Invalid created date format.")
    .optional(),

    modified_date: z
    .date("Invalid modified date format.")
    .optional(),

    profilePicture: z
    .string()
    .trim()
    .nullable()
    .optional()
});

const multiUserSchema = z.array(userSchema);

const passwordSchema = z.object({
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
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match. please check the passwords and try again.",
    path: ["confirmPassword"]
});

const userTokenSchema = z.object({
    userId: z
    .number(),

    token: z
    .string()
    .trim()
    .nonempty("Invalid or expired password reset token."),
});

const userProfileSchema = z.object({
    id: z
    .coerce.number()
    .optional(),
    email: z
        .string()
        .trim()
        .email("Please enter a proper email address"),
    
        userName: z
        .string()
        .trim()
        .min(4, "4 minimum user name characters allowed")
        .optional(),

        role: z
        .enum(["admin", "master", "user"])
        .optional(),

        profilePicture: z
    .string()
    .trim()
    .nullable()
    .optional(),

        created_date: z
        .coerce.date("Invalid created date format.")
        .optional(),

        modified_date: z
        .coerce.date("Invalid modified date format."),

        firstName: z
            .string()
            .trim()
            .min(4, "4 minimum first name characters allowed.")
            .nullable(),
        
            lastName: z
            .string()
            .trim()
            .min(4, "4 minimum last name characters allowed.")
            .nullable(),

            dateOfBirth: z
            .coerce.date("Please select a valid date.")
            .nullable(),
        
            phoneNumber: z
            .string()
            .trim()
            .regex(/^\d{11}$/, "Phone number must be exactly 11 digits.")
            .nullable(),
        
            bio: z
            .string()
            .trim()
            .optional()
            .nullable(),
        
            accountNumber: z
            .string()
            .trim()
            .regex(/^\d{10}$/, "Account number must be exactly 10 digits.")
            .optional()
            .nullable(),
        
            bankName: z
            .string()
            .trim()
            .optional()
            .nullable()
});

export type UserRoleForm = z.infer<typeof userRoleSchema>;
export type UserNameForm = z.infer<typeof userNameSchema>;
export type UserForm = RowDataPacket & z.infer<typeof userSchema>;
export type MultiUserForm = z.infer<typeof multiUserSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;

export { userRoleSchema, userNameSchema, userSchema, multiUserSchema, passwordSchema, userTokenSchema, userProfileSchema };