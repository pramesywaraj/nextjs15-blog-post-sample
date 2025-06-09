import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ArrowLeft, FolderOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategory(slug: string) {
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
              }
            },
            categories: true,
            tags: true,
          },
          orderBy: { publishedAt: "desc" },
        },
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    }
  }

  const title = `${category.name} - Modern Blog`
  const description = category.description || `Browse all posts in the ${category.name} category on Modern Blog. Discover articles, tutorials, and insights.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/blog/category/${category.slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, allCategories] = await Promise.all([
    getCategory(slug),
    getAllCategories()
  ])

  if (!category) {
    notFound()
  }

  const posts = category.posts

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Posts
              </Button>
            </Link>
            <div className="border-l border-slate-200 pl-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-slate-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {category.name}
                </h1>
              </div>
              {category.description && (
                <p className="text-sm text-slate-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {category._count.posts} {category._count.posts === 1 ? 'post' : 'posts'}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Current Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                    <FolderOpen className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-600">
                        {category._count.posts} {category._count.posts === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/blog" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        All Posts
                      </Button>
                    </Link>
                    {allCategories.map((cat) => (
                      <Link key={cat.id} href={`/blog/category/${cat.slug}`} className="block">
                        <Button 
                          variant={cat.id === category.id ? "secondary" : "ghost"} 
                          size="sm" 
                          className="w-full justify-between"
                        >
                          {cat.name}
                          <Badge variant="outline" className="text-xs">
                            {cat._count.posts}
                          </Badge>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Posts in {category.name}
              </h2>
              <p className="text-slate-600">
                {category._count.posts} {category._count.posts === 1 ? 'article' : 'articles'} found in this category
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.image || ""} />
                          <AvatarFallback>
                            {post.author.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 truncate">
                            {post.author.name}
                          </p>
                          <div className="flex items-center text-xs text-slate-500">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {post.publishedAt 
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : new Date(post.createdAt).toLocaleDateString()
                            }
                          </div>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        {post.excerpt && (
                          <CardDescription className="mt-2 line-clamp-3">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.slice(0, 2).map((cat) => (
                          <Badge 
                            key={cat.id} 
                            variant={cat.id === category.id ? "default" : "secondary"} 
                            className="text-xs"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts in this category</h3>
                  <p className="text-slate-600 mb-6">
                    There are no published posts in the {category.name} category yet.
                  </p>
                  <Link href="/blog">
                    <Button>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Browse All Posts
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
} 