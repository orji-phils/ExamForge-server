import z from "zod";
declare const profileSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    userName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodCoercedDate<unknown>;
    phoneNumber: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { profileSchema };
//# sourceMappingURL=profile.schema.d.ts.map