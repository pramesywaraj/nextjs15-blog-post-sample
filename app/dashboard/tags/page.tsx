"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, Search, MoreVertical, Edit, Trash2, Tag, Hash } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const TagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
})

type TagInput = z.infer<typeof TagSchema>

interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

export default function TagsPage() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<TagInput>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  useEffect(() => {
    fetchTags()
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    const name = form.watch("name")
    if (name && !editingTag) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      form.setValue("slug", slug)
    }
  }, [form.watch("name"), form, editingTag])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      toast.error("Failed to load tags")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: TagInput) => {
    setSubmitting(true)
    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create tag")
      }

      const newTag = await response.json()
      setTags([...tags, newTag])
      setDialogOpen(false)
      form.reset()
      toast.success("Tag created successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create tag")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (data: TagInput) => {
    if (!editingTag) return
    
    setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/tags/${editingTag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update tag")
      }

      const updatedTag = await response.json()
      setTags(tags.map(tag => 
        tag.id === editingTag.id ? updatedTag : tag
      ))
      setDialogOpen(false)
      setEditingTag(null)
      form.reset()
      toast.success("Tag updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update tag")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete tag")

      setTags(tags.filter(tag => tag.id !== id))
      toast.success("Tag deleted successfully")
    } catch (error) {
      toast.error("Failed to delete tag")
    }
  }

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag)
    form.reset({
      name: tag.name,
      slug: tag.slug,
    })
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingTag(null)
    form.reset()
    setDialogOpen(true)
  }

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tags...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Add tags to help readers discover related content
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Tag
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
            <CardDescription>
              Manage your blog tags and improve content discoverability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tags Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {tags.length === 0 ? "No tags found. Create your first tag!" : "No tags match your search."}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{tag.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tag.slug}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {tag._count.posts} {tag._count.posts === 1 ? 'post' : 'posts'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(tag.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(tag.id)}
                                className="text-red-600"
                                disabled={tag._count.posts > 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tags.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tags in Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tags.filter(tag => tag._count.posts > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unused Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tags.filter(tag => tag._count.posts === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Edit Tag" : "Create Tag"}
            </DialogTitle>
            <DialogDescription>
              {editingTag 
                ? "Update the tag details below." 
                : "Add a new tag to categorize your blog posts."
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(editingTag ? handleUpdate : handleCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="react" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      {editingTag ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingTag ? "Update Tag" : "Create Tag"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 