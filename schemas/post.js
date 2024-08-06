import { z } from "zod";

//Validaciones con zod:
const postSchema = z.object({
  userId: z.number().positive().int(),
  title: z.string(),
  body: z.string().default("sin body"),
});

export function validatePosts(body) {
  return postSchema.safeParse(body);
}
export function validatePartialPosts(body) {
  return postSchema.partial().safeParse(body);
}
