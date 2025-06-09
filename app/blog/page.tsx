import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CalendarDays, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Suspense } from "react"

async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
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
    })
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

async function getCategories() {
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

function SearchForm() {
  return (
    <form action="/blog/search" method="GET">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              placeholder="Search posts by title, content, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" className="w-full mt-3">
            Search
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="border-l border-slate-200 pl-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                All Posts
              </h1>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button size="sm" variant="outline">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <Suspense fallback={<div>Loading search...</div>}>
                <SearchForm />
              </Suspense>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/blog" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        All Posts
                        <Badge variant="outline">{posts.length}</Badge>
                      </Button>
                    </Link>
                    {categories.map((category) => (
                      <Link key={category.id} href={`/blog/category/${category.slug}`} className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-between">
                          {category.name}
                          <Badge variant="outline">{category._count.posts}</Badge>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Articles</h2>
              <p className="text-slate-600">
                Discover our latest insights, tutorials, and stories. Use the search form to find specific content.
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
                        {post.categories.slice(0, 2).map((category) => (
                          <Badge key={category.id} variant="secondary" className="text-xs">
                            {category.name}
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
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts found</h3>
                  <p className="text-slate-600 mb-6">
                    There are no published posts yet. Check back later for new content.
                  </p>
                  <Link href="/">
                    <Button>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
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