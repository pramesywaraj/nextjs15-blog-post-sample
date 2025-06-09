import { auth } from "@/auth";
import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { CategoryUpdateSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET /api/admin/categories/[id]
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
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// PATCH /api/admin/categories/[id]
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

		// Validate input
		const CategoryUpdatePayloadSchema = CategoryUpdateSchema.omit({ id: true });
		const validatedFields = CategoryUpdatePayloadSchema.safeParse(body);
		if (!validatedFields.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: validatedFields.error.format() },
				{ status: 400 },
			);
		}

		const { name, description, slug } = validatedFields.data;

		// Check if name or slug already exists (excluding current category)
		if (name || slug) {
			const existingCategory = await prisma.category.findFirst({
				where: {
					AND: [
						{ NOT: { id } },
						{
							OR: [...(name ? [{ name }] : []), ...(slug ? [{ slug }] : [])],
						},
					],
				},
			});

			if (existingCategory) {
				return NextResponse.json(
					{ error: "A category with this name or slug already exists" },
					{ status: 400 },
				);
			}
		}

		const updateData: Prisma.CategoryUpdateInput = {};
		if (name !== undefined) updateData.name = name;
		if (description !== undefined) updateData.description = description;
		if (slug !== undefined) updateData.slug = slug;

		const category = await prisma.category.update({
			where: { id },
			data: updateData,
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error updating category:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// DELETE /api/admin/categories/[id]
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
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 },
			);
		}

		// Prevent deletion if category has posts
		if (category._count.posts > 0) {
			return NextResponse.json(
				{ error: "Cannot delete category with associated posts" },
				{ status: 400 },
			);
		}

		await prisma.category.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
