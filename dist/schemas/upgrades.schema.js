"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiUpgradeSchema = exports.upgradeSchema = exports.userNameSchema = exports.statusSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const statusSchema = zod_1.default
    .enum(["", "approved", "pending", "rejected", "revoked"]);
exports.statusSchema = statusSchema;
const userNameSchema = zod_1.default
    .string()
    .trim();
exports.userNameSchema = userNameSchema;
const upgradeSchema = zod_1.default.object({
    userId: zod_1.default
        .number(),
    status: statusSchema,
    request_date: zod_1.default
        .coerce.date()
        .optional(),
    response_date: zod_1.default
        .coerce.date()
        .optional(),
    userName: userNameSchema
        .optional(),
    email: zod_1.default
        .string()
        .trim()
        .email("Invalid email address.")
        .optional(),
    role: zod_1.default
        .enum(["user", "admin", "master"])
        .optional(),
    created_date: zod_1.default
        .coerce.date()
        .optional(),
    profilePicture: zod_1.default
        .string()
        .trim()
        .optional()
});
exports.upgradeSchema = upgradeSchema;
const multiUpgradeSchema = zod_1.default.array(upgradeSchema);
exports.multiUpgradeSchema = multiUpgradeSchema;
//# sourceMappingURL=upgrades.schema.js.map