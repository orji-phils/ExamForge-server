import z from "zod";

const profileSchema = z.object({
    firstName: z
    .string()
    .trim()
    .min(4, "4 minimum first name characters allowed."),

    lastName: z
    .string()
    .trim()
    .min(4, "4 minimum last name characters allowed."),

    userName: z
    .string()
    .optional(),

    dateOfBirth: z
    .coerce.date("Please select a valid date."),

    phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits."),

    bio: z
    .string()
    .trim()
    .optional(),

    accountNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits.")
    .optional(),

    bankName: z
    .string()
    .trim()
    .optional()
});

export { profileSchema };