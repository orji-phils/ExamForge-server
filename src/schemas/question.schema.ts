import { RowDataPacket } from "mysql2";
import z from "zod";

const currentYear = new Date().getFullYear();

const examTypeSchema = z
.enum(["", "jamb", "waec", "neco"]);

const subjectSchema =  z
.enum(["", "accounting", "biology", "chemistry", "computer", "dataprocessing", "economics", "english", "government", "literature", "mathematics", "physics"]);

const yearSchema = z
.coerce.number()
.min(1970, "Question year cannot be less than 1970.")
.max(currentYear, `Question year cannot be greater than ${currentYear}.`)

const questionFieldSchema = z.object({
    examType: examTypeSchema
    .optional(),

    subject: subjectSchema,

    year: yearSchema,

    question: z
    .string()
    .trim()
    .optional(),

    questionFile: z
    .file()
    .optional()
}).refine(file => !file.question && !file.questionFile, {
    message: "Please provide either the question content or upload a file.",
    path: ["question", "questionFile"]
});

const questionSchema = z.object({
    id: z
    .number()
    .min(1)
    .optional(),

    questionNumber: z
    .number()
    .min(1, "Question number cannot be less than 1."),

    question: z
    .string()
    .trim(),

    options: z
    .json(),

    correctAnswer: z
    .string()
    .trim(),

    year: yearSchema
    .optional(),

    subject: subjectSchema
    .optional()
});

const multiExamTypeSchema = z.array(examTypeSchema);
const multiSubjectSchema = z.array(subjectSchema);
const multiYearSchema = z.array(yearSchema);
const multiQuestionSchema = z.array(questionSchema);

export type ExamForm = z.infer<typeof examTypeSchema>;
export type MultiExamForm = z.infer<typeof multiExamTypeSchema>;
export type SubjectForm = z.infer<typeof subjectSchema>;
export type MultiSubjectForm = z.infer<typeof multiSubjectSchema>;
export type YearForm = z.infer<typeof yearSchema>;
export type MultiYearForm = z.infer<typeof multiYearSchema>;
export type QuestionForm = RowDataPacket & z.infer<typeof questionSchema>;
export type MultiQuestionForm = z.infer<typeof multiQuestionSchema>;

export { questionFieldSchema, examTypeSchema, multiExamTypeSchema, subjectSchema, multiSubjectSchema, yearSchema, multiYearSchema, questionSchema, multiQuestionSchema };