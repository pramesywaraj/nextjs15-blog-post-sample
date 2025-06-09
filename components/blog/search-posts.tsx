"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Search, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
  categories: {
    id: string
    name: string
    slug: string
  }[]
  tags: {
    id: string
    name: string
    slug: string
  }[]
}

interface SearchResult {
  posts: Post[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  query: string
  category?: string
}

interface SearchPostsProps {
  initialPosts: Post[]
  categories: Array<{
    id: string
    name: string
    slug: string
    _count: { posts: number }
  }>
}

export default function SearchPosts({ initialPosts, categories }: SearchPostsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const performSearch = useCallback(async (query: string, category: string = "all") => {
    if (!query.trim()) {
      setPosts(initialPosts)
      setSearchResult(null)
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams()
      params.set("q", query)
      if (category !== "all") {
        params.set("category", category)
      }

      const response = await fetch(`/api/blog/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Search failed")
      }

      const result: SearchResult = await response.json()
      setPosts(result.posts)
      setSearchResult(result)

      // Update URL without triggering navigation
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("q", query)
      if (category !== "all") {
        newSearchParams.set("category", category)
      } else {
        newSearchParams.delete("category")
      }
      
      router.replace(`?${newSearchParams.toString()}`, { scroll: false })

    } catch (error) {
      console.error("Search error:", error)
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [initialPosts, router, searchParams])

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedSearchQuery, selectedCategory)
  }, [debouncedSearchQuery, selectedCategory, performSearch])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPosts(initialPosts)
    setSearchResult(null)
    router.replace("/blog", { scroll: false })
  }

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
  }

  const isSearchActive = searchQuery.trim().length > 0

  return (
    <div className="space-y-6">
      {/* Search Section */}
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
            <Input
              type="text"
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-slate-400" />
            )}
            {isSearchActive && !isSearching && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isSearchActive && searchResult && (
            <div className="mt-3 text-sm text-slate-600">
              Found {searchResult.pagination.total} {searchResult.pagination.total === 1 ? 'result' : 'results'} 
              {searchResult.category && searchResult.category !== "all" && (
                <span> in category "{categories.find(c => c.slug === searchResult.category)?.name}"</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-between"
              onClick={() => handleCategoryChange("all")}
            >
              All Posts
              <Badge variant="outline">
                {isSearchActive ? searchResult?.pagination.total || 0 : initialPosts.length}
              </Badge>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-between"
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
                <Badge variant="outline">{category._count.posts}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {isSearchActive && (
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        )}

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
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {isSearchActive ? "No results found" : "No posts found"}
              </h3>
              <p className="text-slate-600 mb-6">
                {isSearchActive 
                  ? `No articles match your search for "${searchQuery}". Try different keywords or browse by category.`
                  : "There are no published posts yet. Check back later for new content."
                }
              </p>
              {isSearchActive && (
                <Button onClick={clearSearch}>
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 