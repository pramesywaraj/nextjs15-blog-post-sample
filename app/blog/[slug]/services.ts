import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { BlogPost } from "./types";

export const getPostBySlug = async (slug: string): Promise<BlogPost> => {
	const post = await prisma.post.findUnique({
		where: {
			slug,
			published: true,
		},
		include: {
			author: {
				select: {
					name: true,
					email: true,
					image: true,
				},
			},
			categories: true,
			tags: true,
		},
	});

	if (!post) {
		notFound();
	}

	return post;
};
