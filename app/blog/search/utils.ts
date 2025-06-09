export const formatPostDate = (
	publishedAt: Date | null,
	createdAt: Date,
): string => {
	const date = publishedAt || createdAt;
	return new Date(date).toLocaleDateString();
};

export const formatSearchResultsText = (total: number): string => {
	return `${total} ${total === 1 ? "result" : "results"}`;
};

export const formatCategoryFilterText = (category?: string): string => {
	return category && category !== "all" ? ` in category "${category}"` : "";
};

export const truncateText = (text: string, maxLength = 100): string => {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trim()}...`;
};

export const highlightSearchTerm = (
	text: string,
	searchTerm: string,
): string => {
	if (!searchTerm) return text;

	const regex = new RegExp(`(${searchTerm})`, "gi");
	return text.replace(regex, "<mark>$1</mark>");
};
