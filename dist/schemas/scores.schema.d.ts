import z from "zod";
declare const scoreSchema: z.ZodArray<z.ZodObject<{
    score: z.ZodCoercedNumber<unknown>;
    subject: z.ZodOptional<z.ZodEnum<{
        biology: "biology";
        computer: "computer";
        economics: "economics";
        mathematics: "mathematics";
        "english language": "english language";
    }>>;
    subjects: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        biology: "biology";
        computer: "computer";
        economics: "economics";
        mathematics: "mathematics";
        "english language": "english language";
    }>>>;
    year: z.ZodCoercedNumber<unknown>;
    examType: z.ZodEnum<{
        jamb: "jamb";
        waec: "waec";
        neco: "neco";
    }>;
    questionID: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    id: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    recordId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    practiceId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    userAnswer: z.ZodOptional<z.ZodString>;
    correctAnswer: z.ZodOptional<z.ZodString>;
    created_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    modified_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>>;
export { scoreSchema };
//# sourceMappingURL=scores.schema.d.ts.map