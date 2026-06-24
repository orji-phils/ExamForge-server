import z from "zod";

const currentYear = new Date().getFullYear();

const scoreSchema = z.array(
    z.object({
        score: z
        .coerce.number()
        .min(0, "Practice score can not be less than 0.")
        .max(100, "Practice score can not be grater than 100"),

        subject: z
        .enum(["mathematics", "english language", "economics", "biology", "computer"])
        .optional(),

        subjects: z
        .array(
            z.enum(["mathematics", "english language", "economics", "biology", "computer"])
        )
        .optional(),

        year: z
        .coerce.number()
        .min(1970, "Cannot practice question before 1970.")
        .max(currentYear, `Cannot practice questions after ${currentYear}`),

        examType: z
        .enum(["jamb", "waec", "neco"]),

        questionID: z
        .coerce.number()
        .min(1, "Question id cannot be less than 1.")
        .optional(),

        id: z
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),

        recordId: z
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),

        practiceId: z
        .coerce.number()
        .min(1, "Practice id cannot be less than 1.")
        .optional(),

        userAnswer: z
        .string()
        .trim()
        .optional(),

        correctAnswer: z
        .string()
        .trim()
        .optional(),

        created_date: z
        .coerce.date()
        .optional(),

        modified_date: z
        .coerce.date()
        .optional()
    })
);

export { scoreSchema };