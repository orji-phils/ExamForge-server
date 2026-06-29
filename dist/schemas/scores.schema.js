"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const currentYear = new Date().getFullYear();
const scoreSchema = zod_1.default.array(zod_1.default.object({
    score: zod_1.default
        .coerce.number()
        .min(0, "Practice score can not be less than 0.")
        .max(100, "Practice score can not be grater than 100"),
    subject: zod_1.default
        .enum(["mathematics", "english language", "economics", "biology", "computer"])
        .optional(),
    subjects: zod_1.default
        .array(zod_1.default.enum(["mathematics", "english language", "economics", "biology", "computer"]))
        .optional(),
    year: zod_1.default
        .coerce.number()
        .min(1970, "Cannot practice question before 1970.")
        .max(currentYear, `Cannot practice questions after ${currentYear}`),
    examType: zod_1.default
        .enum(["jamb", "waec", "neco"]),
    questionID: zod_1.default
        .coerce.number()
        .min(1, "Question id cannot be less than 1.")
        .optional(),
    id: zod_1.default
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),
    recordId: zod_1.default
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),
    practiceId: zod_1.default
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),
    userAnswer: zod_1.default
        .string()
        .trim()
        .optional(),
    correctAnswer: zod_1.default
        .string()
        .trim()
        .optional(),
    created_date: zod_1.default
        .coerce.date()
        .optional(),
    modified_date: zod_1.default
        .coerce.date()
        .optional()
}));
exports.scoreSchema = scoreSchema;
//# sourceMappingURL=scores.schema.js.map