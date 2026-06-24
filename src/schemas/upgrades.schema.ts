import { RowDataPacket } from "mysql2";
import z from "zod";

const statusSchema = z
    .enum(["", "approved", "pending", "rejected", "revoked"]);

    const userNameSchema = z
    .string()
    .trim();

const upgradeSchema = z.object({
    userId: z
    .number(),

    status: statusSchema,

    request_date: z
    .coerce.date()
    .optional(),

    response_date: z
    .coerce.date()
    .optional(),

    userName: userNameSchema
    .optional(),

    email: z
    .string()
    .trim()
    .email("Invalid email address.")
    .optional(),

    role: z
    .enum(["user", "admin", "master"])
    .optional(),

    created_date: z
    .coerce.date()
    .optional(),

    profilePicture: z
    .string()
    .trim()
    .optional()
});

const multiUpgradeSchema = z.array(upgradeSchema);

export type StatusForm = z.infer<typeof statusSchema>;
export type UserNameForm = z.infer<typeof userNameSchema>;
export type UpgradeForm = RowDataPacket & z.infer<typeof upgradeSchema>;
export type MultiUpgradeForm = z.infer<typeof multiUpgradeSchema>;

export { statusSchema, userNameSchema, upgradeSchema, multiUpgradeSchema, };