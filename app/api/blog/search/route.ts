import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const category = searchParams.get("category");
		const limit = Number.parseInt(searchParams.get("limit") || "20");
		const offset = Number.parseInt(searchParams.get("offset") || "0");

		if (!query) {
			return NextResponse.json(
				{ error: "Search query is required" },
				{ status: 400 },
			);
		}

		// Build search conditions
		const searchConditions: Prisma.PostWhereInput = {
			published: true,
			OR: [
				{
					title: {
						contains: query,
						mode: "insensitive" as const,
					},
				},
				{
					excerpt: {
						contains: query,
						mode: "insensitive" as const,
					},
				},
				{
					content: {
						contains: query,
						mode: "insensitive" as const,
					},
				},
				{
					categories: {
						some: {
							name: {
								contains: query,
								mode: "insensitive" as const,
							},
						},
					},
				},
				{
					tags: {
						some: {
							name: {
								contains: query,
								mode: "insensitive" as const,
							},
						},
					},
				},
			],
		};

		// Add category filter if specified
		if (category && category !== "all") {
			searchConditions.AND = [
				{ OR: searchConditions.OR },
				{
					categories: {
						some: {
							slug: category,
						},
					},
				},
			];
			searchConditions.OR = [];
		}

		// Get total count for pagination
		const totalCount = await prisma.post.count({
			where: searchConditions,
		});

		// Search posts
		const posts = await prisma.post.findMany({
			where: searchConditions,
			include: {
				author: {
					select: {
						name: true,
						image: true,
					},
				},
				categories: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				tags: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
			},
			orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
			take: limit,
			skip: offset,
		});

		return NextResponse.json({
			posts,
			pagination: {
				total: totalCount,
				limit,
				offset,
				hasMore: offset + limit < totalCount,
			},
			query,
			category,
		});
	} catch (error) {
		console.error("Search error:", error);

		// Fallback search without relevance (for databases that don't support it)
		try {
			const { searchParams } = new URL(request.url);
			const query = searchParams.get("q");
			const category = searchParams.get("category");
			const limit = Number.parseInt(searchParams.get("limit") || "20");
			const offset = Number.parseInt(searchParams.get("offset") || "0");

			if (!query) {
				return NextResponse.json(
					{ error: "Search query is required" },
					{ status: 400 },
				);
			}

			const searchConditions: Prisma.PostWhereInput = {
				published: true,
				OR: [
					{
						title: {
							contains: query,
							mode: "insensitive" as const,
						},
					},
					{
						excerpt: {
							contains: query,
							mode: "insensitive" as const,
						},
					},
					{
						content: {
							contains: query,
							mode: "insensitive" as const,
						},
					},
					{
						categories: {
							some: {
								name: {
									contains: query,
									mode: "insensitive" as const,
								},
							},
						},
					},
					{
						tags: {
							some: {
								name: {
									contains: query,
									mode: "insensitive" as const,
								},
							},
						},
					},
				],
			};

			if (category && category !== "all") {
				searchConditions.AND = [
					{ OR: searchConditions.OR },
					{
						categories: {
							some: {
								slug: category,
							},
						},
					},
				];
				searchConditions.OR = [];
			}

			const totalCount = await prisma.post.count({
				where: searchConditions,
			});

			const posts = await prisma.post.findMany({
				where: searchConditions,
				include: {
					author: {
						select: {
							name: true,
							image: true,
						},
					},
					categories: {
						select: {
							id: true,
							name: true,
							slug: true,
						},
					},
					tags: {
						select: {
							id: true,
							name: true,
							slug: true,
						},
					},
				},
				orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
				take: limit,
				skip: offset,
			});

			return NextResponse.json({
				posts,
				pagination: {
					total: totalCount,
					limit,
					offset,
					hasMore: offset + limit < totalCount,
				},
				query,
				category,
			});
		} catch (fallbackError) {
			console.error("Fallback search error:", fallbackError);
			return NextResponse.json({ error: "Search failed" }, { status: 500 });
		}
	}
}
