import { z } from "zod";

export const BlogPostSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	excerpt: z.string().nullable(),
	publishedAt: z.date().nullable(),
	createdAt: z.date(),
});

export const CategorySchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Category name is required"),
	slug: z.string().min(1, "Category slug is required"),
});

export type BlogPostInput = z.infer<typeof BlogPostSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
