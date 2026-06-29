import { RowDataPacket } from "mysql2";
import z from "zod";
declare const examTypeSchema: z.ZodEnum<{
    "": "";
    jamb: "jamb";
    waec: "waec";
    neco: "neco";
}>;
declare const subjectSchema: z.ZodEnum<{
    "": "";
    accounting: "accounting";
    biology: "biology";
    chemistry: "chemistry";
    computer: "computer";
    dataprocessing: "dataprocessing";
    economics: "economics";
    english: "english";
    government: "government";
    literature: "literature";
    mathematics: "mathematics";
    physics: "physics";
}>;
declare const yearSchema: z.ZodCoercedNumber<unknown>;
declare const questionFieldSchema: z.ZodObject<{
    examType: z.ZodOptional<z.ZodEnum<{
        "": "";
        jamb: "jamb";
        waec: "waec";
        neco: "neco";
    }>>;
    subject: z.ZodEnum<{
        "": "";
        accounting: "accounting";
        biology: "biology";
        chemistry: "chemistry";
        computer: "computer";
        dataprocessing: "dataprocessing";
        economics: "economics";
        english: "english";
        government: "government";
        literature: "literature";
        mathematics: "mathematics";
        physics: "physics";
    }>;
    year: z.ZodCoercedNumber<unknown>;
    question: z.ZodOptional<z.ZodString>;
    questionFile: z.ZodOptional<z.ZodFile>;
}, z.core.$strip>;
declare const questionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    questionNumber: z.ZodNumber;
    question: z.ZodString;
    options: z.ZodJSONSchema;
    correctAnswer: z.ZodString;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    subject: z.ZodOptional<z.ZodEnum<{
        "": "";
        accounting: "accounting";
        biology: "biology";
        chemistry: "chemistry";
        computer: "computer";
        dataprocessing: "dataprocessing";
        economics: "economics";
        english: "english";
        government: "government";
        literature: "literature";
        mathematics: "mathematics";
        physics: "physics";
    }>>;
}, z.core.$strip>;
declare const multiExamTypeSchema: z.ZodArray<z.ZodEnum<{
    "": "";
    jamb: "jamb";
    waec: "waec";
    neco: "neco";
}>>;
declare const multiSubjectSchema: z.ZodArray<z.ZodEnum<{
    "": "";
    accounting: "accounting";
    biology: "biology";
    chemistry: "chemistry";
    computer: "computer";
    dataprocessing: "dataprocessing";
    economics: "economics";
    english: "english";
    government: "government";
    literature: "literature";
    mathematics: "mathematics";
    physics: "physics";
}>>;
declare const multiYearSchema: z.ZodArray<z.ZodCoercedNumber<unknown>>;
declare const multiQuestionSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    questionNumber: z.ZodNumber;
    question: z.ZodString;
    options: z.ZodJSONSchema;
    correctAnswer: z.ZodString;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    subject: z.ZodOptional<z.ZodEnum<{
        "": "";
        accounting: "accounting";
        biology: "biology";
        chemistry: "chemistry";
        computer: "computer";
        dataprocessing: "dataprocessing";
        economics: "economics";
        english: "english";
        government: "government";
        literature: "literature";
        mathematics: "mathematics";
        physics: "physics";
    }>>;
}, z.core.$strip>>;
export type ExamForm = z.infer<typeof examTypeSchema>;
export type MultiExamForm = z.infer<typeof multiExamTypeSchema>;
export type SubjectForm = z.infer<typeof subjectSchema>;
export type MultiSubjectForm = z.infer<typeof multiSubjectSchema>;
export type YearForm = z.infer<typeof yearSchema>;
export type MultiYearForm = z.infer<typeof multiYearSchema>;
export type QuestionForm = RowDataPacket & z.infer<typeof questionSchema>;
export type MultiQuestionForm = z.infer<typeof multiQuestionSchema>;
export { questionFieldSchema, examTypeSchema, multiExamTypeSchema, subjectSchema, multiSubjectSchema, yearSchema, multiYearSchema, questionSchema, multiQuestionSchema };
//# sourceMappingURL=question.schema.d.ts.map