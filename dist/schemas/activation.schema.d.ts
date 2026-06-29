import z from "zod";
declare const activateSchema: z.ZodObject<{
    userId: z.ZodCoercedNumber<unknown>;
    userName: z.ZodString;
}, z.core.$strip>;
export { activateSchema };
//# sourceMappingURL=activation.schema.d.ts.map