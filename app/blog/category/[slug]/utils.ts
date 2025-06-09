export const formatDate = (date: Date | string | null): string => {
	if (!date) return "Unknown date";

	const dateObj = date instanceof Date ? date : new Date(date);
	return dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatPostDate = (
	publishedAt: Date | null,
	createdAt: Date,
): string => {
	const date = publishedAt || createdAt;
	return formatDate(date);
};

export const generateMetaTitle = (categoryName: string): string => {
	return `${categoryName} - Modern Blog`;
};

export const generateMetaDescription = (
	categoryName: string,
	description?: string | null,
): string => {
	return (
		description ||
		`Browse all posts in the ${categoryName} category on Modern Blog. Discover articles, tutorials, and insights.`
	);
};
