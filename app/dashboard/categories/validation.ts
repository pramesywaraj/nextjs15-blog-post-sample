import { z } from "zod";

export const CategorySchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	description: z.string().optional(),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
