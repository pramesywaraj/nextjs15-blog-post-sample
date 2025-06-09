import { z } from "zod";

export const TagSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(50, "Name must be less than 50 characters"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
});

export type TagInput = z.infer<typeof TagSchema>;
