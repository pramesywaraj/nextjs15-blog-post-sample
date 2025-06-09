import { z } from "zod";

export const SearchQuerySchema = z.object({
	q: z
		.string()
		.min(1, "Search query is required")
		.max(100, "Search query too long")
		.trim(),
	category: z.string().optional(),
});

export const SearchParamsSchema = z.object({
	q: z.string().optional(),
	category: z.string().optional(),
});

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
export type SearchParamsInput = z.infer<typeof SearchParamsSchema>;
