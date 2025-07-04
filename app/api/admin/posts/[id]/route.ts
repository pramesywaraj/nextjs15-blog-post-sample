import { auth } from "@/auth";
import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { PostUpdateSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET /api/admin/posts/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const post = await prisma.post.findUnique({
			where: { id },
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

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		return NextResponse.json(post);
	} catch (error) {
		console.error("Error fetching post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// PATCH /api/admin/posts/[id]
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();

		// For simple updates like toggling published status
		if (body.published !== undefined && Object.keys(body).length === 1) {
			const post = await prisma.post.update({
				where: { id },
				data: { published: body.published },
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

			return NextResponse.json(post);
		}

		// For full post updates - create a schema that doesn't require the id field
		const PostUpdatePayloadSchema = PostUpdateSchema.omit({ id: true });
		const validatedFields = PostUpdatePayloadSchema.safeParse(body);
		if (!validatedFields.success) {
			console.error("Validation error:", validatedFields.error.format());
			return NextResponse.json(
				{ error: "Invalid input", details: validatedFields.error.format() },
				{ status: 400 },
			);
		}

		const { title, content, excerpt, slug, published, categoryIds, tagIds } =
			validatedFields.data;

		// Check if slug already exists (excluding current post)
		if (slug) {
			const existingPost = await prisma.post.findFirst({
				where: {
					slug,
					NOT: { id },
				},
			});

			if (existingPost) {
				return NextResponse.json(
					{ error: "A post with this slug already exists" },
					{ status: 400 },
				);
			}
		}

		// Update the post with relationships
		const updateData: Prisma.PostUpdateInput = {};

		if (title !== undefined) updateData.title = title;
		if (content !== undefined) updateData.content = content;
		if (excerpt !== undefined) updateData.excerpt = excerpt;
		if (slug !== undefined) updateData.slug = slug;
		if (published !== undefined) updateData.published = published;

		// Handle categories relationship
		if (categoryIds !== undefined) {
			updateData.categories = {
				set: [], // Clear existing categories
				connect: categoryIds.map((catId) => ({ id: catId })),
			};
		}

		// Handle tags relationship
		if (tagIds !== undefined) {
			updateData.tags = {
				set: [], // Clear existing tags
				connect: tagIds.map((tagId) => ({ id: tagId })),
			};
		}

		const post = await prisma.post.update({
			where: { id },
			data: updateData,
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

		return NextResponse.json(post);
	} catch (error) {
		console.error("Error updating post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// DELETE /api/admin/posts/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const post = await prisma.post.findUnique({
			where: { id },
		});

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		await prisma.post.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
