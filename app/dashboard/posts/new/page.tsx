"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PostEditor from "@/components/blog/post-editor"
import { toast } from "sonner"

export default function NewPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (data: any) => {
    console.log("handleSave called with data:", data)
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log("API response:", response.status, responseData)

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to create post")
      }

      toast.success("Post created successfully!")
      router.push("/dashboard/posts")
    } catch (error) {
      console.error("Save error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/posts")
  }

  return (
    <PostEditor
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )
} 