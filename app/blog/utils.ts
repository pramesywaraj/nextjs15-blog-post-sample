export const formatPostDate = (
	publishedAt: Date | null,
	createdAt: Date,
): string => {
	const date = publishedAt || createdAt;
	return new Date(date).toLocaleDateString();
};

export const getAuthorInitial = (name: string | null): string => {
	return (name || "A")[0].toUpperCase();
};

export const truncateText = (text: string, maxLength = 150): string => {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trim()}...`;
};

export const generatePageDescription = (postsCount: number): string => {
	if (postsCount === 0) {
		return "No published posts yet. Check back later for new content.";
	}
	return "Discover our latest insights, tutorials, and stories. Use the search form to find specific content.";
};
