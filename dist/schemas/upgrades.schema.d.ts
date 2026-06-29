import { RowDataPacket } from "mysql2";
import z from "zod";
declare const statusSchema: z.ZodEnum<{
    "": "";
    approved: "approved";
    pending: "pending";
    rejected: "rejected";
    revoked: "revoked";
}>;
declare const userNameSchema: z.ZodString;
declare const upgradeSchema: z.ZodObject<{
    userId: z.ZodNumber;
    status: z.ZodEnum<{
        "": "";
        approved: "approved";
        pending: "pending";
        rejected: "rejected";
        revoked: "revoked";
    }>;
    request_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    response_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    userName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
        master: "master";
    }>>;
    created_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    profilePicture: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const multiUpgradeSchema: z.ZodArray<z.ZodObject<{
    userId: z.ZodNumber;
    status: z.ZodEnum<{
        "": "";
        approved: "approved";
        pending: "pending";
        rejected: "rejected";
        revoked: "revoked";
    }>;
    request_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    response_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    userName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
        master: "master";
    }>>;
    created_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    profilePicture: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type StatusForm = z.infer<typeof statusSchema>;
export type UserNameForm = z.infer<typeof userNameSchema>;
export type UpgradeForm = RowDataPacket & z.infer<typeof upgradeSchema>;
export type MultiUpgradeForm = z.infer<typeof multiUpgradeSchema>;
export { statusSchema, userNameSchema, upgradeSchema, multiUpgradeSchema, };
//# sourceMappingURL=upgrades.schema.d.ts.map