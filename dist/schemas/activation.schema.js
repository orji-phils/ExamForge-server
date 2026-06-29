"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const activateSchema = zod_1.default.object({
    userId: zod_1.default
        .coerce.number(),
    userName: zod_1.default
        .string()
        .trim()
});
exports.activateSchema = activateSchema;
//# sourceMappingURL=activation.schema.js.map