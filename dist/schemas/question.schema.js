"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiQuestionSchema = exports.questionSchema = exports.multiYearSchema = exports.yearSchema = exports.multiSubjectSchema = exports.subjectSchema = exports.multiExamTypeSchema = exports.examTypeSchema = exports.questionFieldSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const currentYear = new Date().getFullYear();
const examTypeSchema = zod_1.default
    .enum(["", "jamb", "waec", "neco"]);
exports.examTypeSchema = examTypeSchema;
const subjectSchema = zod_1.default
    .enum(["", "accounting", "biology", "chemistry", "computer", "dataprocessing", "economics", "english", "government", "literature", "mathematics", "physics"]);
exports.subjectSchema = subjectSchema;
const yearSchema = zod_1.default
    .coerce.number()
    .min(1970, "Question year cannot be less than 1970.")
    .max(currentYear, `Question year cannot be greater than ${currentYear}.`);
exports.yearSchema = yearSchema;
const questionFieldSchema = zod_1.default.object({
    examType: examTypeSchema
        .optional(),
    subject: subjectSchema,
    year: yearSchema,
    question: zod_1.default
        .string()
        .trim()
        .optional(),
    questionFile: zod_1.default
        .file()
        .optional()
}).refine(file => !file.question && !file.questionFile, {
    message: "Please provide either the question content or upload a file.",
    path: ["question", "questionFile"]
});
exports.questionFieldSchema = questionFieldSchema;
const questionSchema = zod_1.default.object({
    id: zod_1.default
        .number()
        .min(1)
        .optional(),
    questionNumber: zod_1.default
        .number()
        .min(1, "Question number cannot be less than 1."),
    question: zod_1.default
        .string()
        .trim(),
    options: zod_1.default
        .json(),
    correctAnswer: zod_1.default
        .string()
        .trim(),
    year: yearSchema
        .optional(),
    subject: subjectSchema
        .optional()
});
exports.questionSchema = questionSchema;
const multiExamTypeSchema = zod_1.default.array(examTypeSchema);
exports.multiExamTypeSchema = multiExamTypeSchema;
const multiSubjectSchema = zod_1.default.array(subjectSchema);
exports.multiSubjectSchema = multiSubjectSchema;
const multiYearSchema = zod_1.default.array(yearSchema);
exports.multiYearSchema = multiYearSchema;
const multiQuestionSchema = zod_1.default.array(questionSchema);
exports.multiQuestionSchema = multiQuestionSchema;
//# sourceMappingURL=question.schema.js.map