import { RowDataPacket } from "mysql2";
import z from "zod";
declare const userRoleSchema: z.ZodEnum<{
    "": "";
    user: "user";
    admin: "admin";
    master: "master";
}>;
declare const userNameSchema: z.ZodString;
declare const userSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
    userName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        "": "";
        user: "user";
        admin: "admin";
        master: "master";
    }>>;
    created_date: z.ZodOptional<z.ZodDate>;
    modified_date: z.ZodOptional<z.ZodDate>;
    profilePicture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const multiUserSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
    userName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        "": "";
        user: "user";
        admin: "admin";
        master: "master";
    }>>;
    created_date: z.ZodOptional<z.ZodDate>;
    modified_date: z.ZodOptional<z.ZodDate>;
    profilePicture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>>;
declare const passwordSchema: z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
declare const userTokenSchema: z.ZodObject<{
    userId: z.ZodNumber;
    token: z.ZodString;
}, z.core.$strip>;
declare const userProfileSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    email: z.ZodString;
    userName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
        master: "master";
    }>>;
    profilePicture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    modified_date: z.ZodCoercedDate<unknown>;
    firstName: z.ZodNullable<z.ZodString>;
    lastName: z.ZodNullable<z.ZodString>;
    dateOfBirth: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    phoneNumber: z.ZodNullable<z.ZodString>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    accountNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bankName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UserRoleForm = z.infer<typeof userRoleSchema>;
export type UserNameForm = z.infer<typeof userNameSchema>;
export type UserForm = RowDataPacket & z.infer<typeof userSchema>;
export type MultiUserForm = z.infer<typeof multiUserSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
export { userRoleSchema, userNameSchema, userSchema, multiUserSchema, passwordSchema, userTokenSchema, userProfileSchema };
//# sourceMappingURL=user.schema.d.ts.map