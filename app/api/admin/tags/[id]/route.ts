import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TagUpdateSchema } from "@/lib/validations"

// GET /api/admin/tags/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tags/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedFields = TagUpdateSchema.safeParse(body)
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const { name, slug } = validatedFields.data

    // Check if name or slug already exists (excluding current tag)
    if (name || slug) {
      const existingTag = await prisma.tag.findFirst({
        where: {
          AND: [
            { NOT: { id: params.id } },
            {
              OR: [
                ...(name ? [{ name }] : []),
                ...(slug ? [{ slug }] : [])
              ]
            }
          ]
        }
      })

      if (existingTag) {
        return NextResponse.json(
          { error: "A tag with this name or slug already exists" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Prevent deletion if tag has posts
    if (tag._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with associated posts" },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Tag deleted successfully" })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 