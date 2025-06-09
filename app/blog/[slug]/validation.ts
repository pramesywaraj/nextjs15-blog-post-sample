import { z } from "zod";

export const BlogPostSlugSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export const BlogPostParamsSchema = z.object({
	params: z.promise(BlogPostSlugSchema),
});

export type BlogPostSlugInput = z.infer<typeof BlogPostSlugSchema>;
export type BlogPostParamsInput = z.infer<typeof BlogPostParamsSchema>;
