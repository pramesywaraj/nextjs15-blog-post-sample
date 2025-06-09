import { prisma } from "@/lib/prisma";
import type { CategorySummary, CategoryWithPosts } from "./types";

export const getCategoryBySlug = async (
	slug: string,
): Promise<CategoryWithPosts | null> => {
	try {
		return await prisma.category.findUnique({
			where: { slug },
			include: {
				posts: {
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
				},
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
		console.error("Error fetching category:", error);
		return null;
	}
};

export const getAllCategories = async (): Promise<CategorySummary[]> => {
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

export const getCategoryData = async (slug: string) => {
	const [category, allCategories] = await Promise.all([
		getCategoryBySlug(slug),
		getAllCategories(),
	]);

	return {
		category,
		allCategories,
	};
};
