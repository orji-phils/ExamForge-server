import z from "zod";

const activateSchema = z.object({
    userId: z
    .coerce.number(),

    userName: z
    .string()
    .trim()
});

export { activateSchema };