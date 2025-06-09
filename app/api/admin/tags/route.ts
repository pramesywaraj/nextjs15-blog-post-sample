import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TagSchema } from "@/lib/validations";

// GET /api/admin/tags
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tags = await prisma.tag.findMany({
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(tags);
	} catch (error) {
		console.error("Error fetching tags:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// POST /api/admin/tags
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validate input
		const validatedFields = TagSchema.safeParse(body);
		if (!validatedFields.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: validatedFields.error.format() },
				{ status: 400 },
			);
		}

		const { name, slug } = validatedFields.data;

		// Check if name or slug already exists
		const existingTag = await prisma.tag.findFirst({
			where: {
				OR: [{ name }, { slug }],
			},
		});

		if (existingTag) {
			return NextResponse.json(
				{ error: "A tag with this name or slug already exists" },
				{ status: 400 },
			);
		}

		const tag = await prisma.tag.create({
			data: {
				name,
				slug,
			},
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		return NextResponse.json(tag, { status: 201 });
	} catch (error) {
		console.error("Error creating tag:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
