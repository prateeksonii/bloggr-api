import { z } from "zod";

export const signInValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(4),
  }),
});

export type SignInValidator = z.infer<typeof signInValidator>;
export type SignInBody = SignInValidator["body"];
