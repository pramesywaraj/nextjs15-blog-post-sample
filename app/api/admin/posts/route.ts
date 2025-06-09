import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET /api/admin/posts
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const posts = await prisma.post.findMany({
			include: {
				author: {
					select: {
						name: true,
						email: true,
					},
				},
				categories: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: {
						tags: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// POST /api/admin/posts
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validate input
		const validatedFields = PostSchema.safeParse(body);
		if (!validatedFields.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: validatedFields.error.format() },
				{ status: 400 },
			);
		}

		const { title, content, excerpt, slug, published, categoryIds, tagIds } =
			validatedFields.data;

		// Check if slug already exists
		const existingPost = await prisma.post.findUnique({
			where: { slug },
		});

		if (existingPost) {
			return NextResponse.json(
				{ error: "A post with this slug already exists" },
				{ status: 400 },
			);
		}

		// Create the post with relationships
		const post = await prisma.post.create({
			data: {
				title,
				content,
				excerpt,
				slug,
				published,
				authorId: session.user.id,
				...(categoryIds &&
					categoryIds.length > 0 && {
						categories: {
							connect: categoryIds.map((id) => ({ id })),
						},
					}),
				...(tagIds &&
					tagIds.length > 0 && {
						tags: {
							connect: tagIds.map((id) => ({ id })),
						},
					}),
			},
			include: {
				author: {
					select: {
						name: true,
						email: true,
					},
				},
				categories: true,
				tags: true,
			},
		});

		return NextResponse.json(post, { status: 201 });
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
