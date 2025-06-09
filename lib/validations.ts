import { z } from "zod"

// Auth schemas
export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Post schemas
export const PostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
})

export const PostUpdateSchema = PostSchema.partial().extend({
  id: z.string(),
})

// Category schemas
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
})

export const CategoryUpdateSchema = CategorySchema.partial().extend({
  id: z.string(),
})

// Tag schemas
export const TagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
})

export const TagUpdateSchema = TagSchema.partial().extend({
  id: z.string(),
})

// User update schema
export const UserUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email").optional(),
  image: z.string().url("Please enter a valid URL").optional(),
})

// Types
export type SignInInput = z.infer<typeof SignInSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type PostInput = z.infer<typeof PostSchema>
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>
export type CategoryInput = z.infer<typeof CategorySchema>
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>
export type TagInput = z.infer<typeof TagSchema>
export type TagUpdateInput = z.infer<typeof TagUpdateSchema>
export type UserUpdateInput = z.infer<typeof UserUpdateSchema> 