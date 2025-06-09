import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, Tags, Eye, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getDashboardStats() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      recentPosts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          categories: true,
          _count: {
            select: { tags: true }
          }
        }
      })
    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      recentPosts
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalCategories: 0,
      totalTags: 0,
      recentPosts: []
    }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statsCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      description: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
      icon: FileText,
      trend: "+12% from last month"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      description: "Content categories",
      icon: FolderOpen,
      trend: "+2 this month"
    },
    {
      title: "Tags",
      value: stats.totalTags,
      description: "Content tags",
      icon: Tags,
      trend: "+8 this month"
    },
    {
      title: "Page Views",
      value: "2.4K",
      description: "This month",
      icon: Eye,
      trend: "+18% from last month"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your blog.</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post: any) => (
                <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.categories.slice(0, 2).map((category: any) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No posts yet</p>
                <Link href="/dashboard/posts/new">
                  <Button>Create Your First Post</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/posts/new">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </Link>
            <Link href="/dashboard/categories">
              <Button variant="outline" className="w-full justify-start">
                <FolderOpen className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/dashboard/tags">
              <Button variant="outline" className="w-full justify-start">
                <Tags className="w-4 h-4 mr-2" />
                Manage Tags
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Public Site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 