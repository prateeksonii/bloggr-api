import { z } from "zod";

export const createBlogValidator = z.object({
  body: z.object({
    title: z.string().min(4),
    content: z.string().min(4),
  }),
});

export type CreateBlogValidator = z.infer<typeof createBlogValidator>;
export type CreateBlogBody = CreateBlogValidator["body"];

export const getBlogBySlugValidator = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export type GetBlogBySlugValidator = z.infer<typeof getBlogBySlugValidator>;
export type GetBlogBySlugParams = GetBlogBySlugValidator["params"];

export const likeBlogValidator = z.object({
  params: z.object({
    blogId: z.string(),
  }),
});

export type LikeBlogValidator = z.infer<typeof likeBlogValidator>;
export type LikeBlogParams = LikeBlogValidator["params"];
