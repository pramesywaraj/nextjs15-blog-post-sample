import type { SearchResult } from "./types";

export const searchPosts = async (
	query: string,
	category?: string,
): Promise<SearchResult> => {
	try {
		const params = new URLSearchParams();
		params.set("q", query);
		if (category && category !== "all") {
			params.set("category", category);
		}

		const baseUrl =
			process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000";

		const response = await fetch(
			`${baseUrl}/api/blog/search?${params.toString()}`,
			{
				cache: "no-store",
			},
		);

		if (!response.ok) {
			throw new Error("Search failed");
		}

		return await response.json();
	} catch (error) {
		console.error("Search error:", error);
		return {
			posts: [],
			pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
			query,
			category,
		};
	}
};

export const getSearchResults = async (query?: string, category?: string) => {
	if (!query) return null;
	return await searchPosts(query, category);
};
