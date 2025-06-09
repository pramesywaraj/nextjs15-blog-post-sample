import { z } from "zod";

// Filters validation schema
export const PostFiltersSchema = z.object({
	searchTerm: z.string().optional(),
	statusFilter: z.enum(["all", "published", "draft"]).default("all"),
	categoryFilter: z.string().default("all"),
});

export type PostFilters = z.infer<typeof PostFiltersSchema>;

// Post update schema for basic operations (publish/unpublish)
export const PostUpdateSchema = z.object({
	published: z.boolean(),
});

export type PostUpdate = z.infer<typeof PostUpdateSchema>;

// Note: For post creation, we use PostInput from @/lib/validations
// to maintain consistency with the PostEditor component
