import { z } from "zod";

export const CreateUserFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(20, { message: "Name must be at most 20 characters long." })
    .trim(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" })
    .trim(),
});
