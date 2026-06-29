import { z } from "zod";
declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    userName: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
declare const signinSchema: z.ZodObject<{
    userName: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export { signupSchema, signinSchema };
//# sourceMappingURL=auth.schema.d.ts.map