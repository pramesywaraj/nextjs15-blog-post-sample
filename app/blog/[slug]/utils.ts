import type { Metadata } from "next";
import type { BlogPost, StructuredData } from "./types";

export const estimateReadingTime = (content: string): number => {
	const wordsPerMinute = 200;
	const words = content.split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
};

export const generateBlogPostMetadata = (post: BlogPost): Metadata => {
	const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
	const url = `${baseUrl}/blog/${post.slug}`;
	const description = post.excerpt || `${post.content.substring(0, 160)}...`;

	return {
		title: post.title,
		description,
		keywords: post.tags.map((tag) => tag.name).join(", "),
		authors: [{ name: post.author.name || "Anonymous" }],
		openGraph: {
			title: post.title,
			description,
			url,
			siteName: "Blog",
			type: "article",
			publishedTime: post.createdAt.toISOString(),
			modifiedTime: post.updatedAt.toISOString(),
			authors: [post.author.name || "Anonymous"],
			tags: post.tags.map((tag) => tag.name),
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description,
			creator: post.author.name
				? `@${post.author.name.replace(/\s+/g, "")}`
				: undefined,
		},
		alternates: {
			canonical: url,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
};

export const generateStructuredData = (post: BlogPost): StructuredData => {
	const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.excerpt || `${post.content.substring(0, 160)}...`,
		url: `${baseUrl}/blog/${post.slug}`,
		datePublished: post.createdAt.toISOString(),
		dateModified: post.updatedAt.toISOString(),
		author: {
			"@type": "Person",
			name: post.author.name || "Anonymous",
			url: `${baseUrl}/authors/${post.author.name?.toLowerCase().replace(/\s+/g, "-")}`,
		},
		publisher: {
			"@type": "Organization",
			name: "Blog",
			url: baseUrl,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${baseUrl}/blog/${post.slug}`,
		},
		keywords: post.tags.map((tag) => tag.name).join(", "),
		articleSection: post.categories.map((category) => category.name).join(", "),
		wordCount: post.content.split(/\s+/).length,
		inLanguage: "en-US",
	};
};

export const formatPublishDate = (date: Date): string => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const getAuthorInitial = (name: string | null): string => {
	return (name || "A")[0].toUpperCase();
};
