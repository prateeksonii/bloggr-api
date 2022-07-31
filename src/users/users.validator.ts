import { z } from "zod";

export const createUserValidator = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
  }),
});

export type CreateUserValidator = z.infer<typeof createUserValidator>;
export type CreateUserBody = CreateUserValidator["body"];
