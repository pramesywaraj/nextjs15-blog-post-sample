import { prisma } from "@/lib/prisma";
import type { BlogPageData, BlogPost, Category } from "./types";

export const getAllPosts = async (): Promise<BlogPost[]> => {
	try {
		return await prisma.post.findMany({
			where: { published: true },
			include: {
				author: {
					select: {
						name: true,
						image: true,
					},
				},
				categories: true,
				tags: true,
			},
			orderBy: { publishedAt: "desc" },
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
};

export const getCategories = async (): Promise<Category[]> => {
	try {
		return await prisma.category.findMany({
			include: {
				_count: {
					select: {
						posts: {
							where: { published: true },
						},
					},
				},
			},
		});
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
};

export const getBlogPageData = async (): Promise<BlogPageData> => {
	const [posts, categories] = await Promise.all([
		getAllPosts(),
		getCategories(),
	]);

	return {
		posts,
		categories,
	};
};
