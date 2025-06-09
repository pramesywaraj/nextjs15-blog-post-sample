"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import PostEditor from "@/components/blog/post-editor"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  published: boolean
  categories: Array<{ id: string; name: string; slug: string }>
  tags: Array<{ id: string; name: string; slug: string }>
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      setIsInitialLoading(true)
      const response = await fetch(`/api/admin/posts/${postId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Post not found")
          router.push("/dashboard/posts")
          return
        }
        throw new Error("Failed to fetch post")
      }

      const postData = await response.json()
      setPost(postData)
    } catch (error) {
      console.error("Error fetching post:", error)
      toast.error("Failed to load post")
      router.push("/dashboard/posts")
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update post")
      }

      toast.success("Post updated successfully!")
      router.push("/dashboard/posts")
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/posts")
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Post not found</p>
          <button 
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Posts
          </button>
        </div>
      </div>
    )
  }

  return (
    <PostEditor
      initialData={post}
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )
} 