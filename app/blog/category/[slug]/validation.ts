import { z } from "zod";

// Category slug validation
export const CategorySlugSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export type CategorySlugInput = z.infer<typeof CategorySlugSchema>;
