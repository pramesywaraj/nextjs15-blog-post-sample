"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PostInput } from "@/lib/validations";

// Local schema for the editor
const PostEditorSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	excerpt: z.string().optional(),
	slug: z.string().min(1, "Slug is required"),
	published: z.boolean(),
	categoryIds: z.array(z.string()).optional(),
	tagIds: z.array(z.string()).optional(),
});

type PostEditorInput = z.infer<typeof PostEditorSchema>;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
	() => import("@uiw/react-md-editor").then((mod) => mod.default),
	{ ssr: false },
);

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface Tag {
	id: string;
	name: string;
	slug: string;
}

interface PostData {
	id?: string;
	title: string;
	content: string;
	excerpt?: string;
	slug: string;
	published: boolean;
	categories?: Category[];
	tags?: Tag[];
}

interface PostEditorProps {
	initialData?: PostData;
	onSave: (data: PostInput) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function PostEditor({
	initialData,
	onSave,
	onCancel,
	isLoading,
}: PostEditorProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [content, setContent] = useState(initialData?.content || "");

	const form = useForm<PostEditorInput>({
		resolver: zodResolver(PostEditorSchema),
		defaultValues: {
			title: initialData?.title || "",
			content: initialData?.content || "",
			excerpt: initialData?.excerpt || "",
			slug: initialData?.slug || "",
			published: initialData?.published || false,
			categoryIds: initialData?.categories?.map((c: Category) => c.id) || [],
			tagIds: initialData?.tags?.map((t: Tag) => t.id) || [],
		},
	});

	useEffect(() => {
		fetchCategories();
		fetchTags();

		if (initialData) {
			setContent(initialData.content || "");
			setSelectedCategories(
				initialData.categories?.map((c: Category) => c.id) || [],
			);
			setSelectedTags(initialData.tags?.map((t: Tag) => t.id) || []);
		}
	}, [initialData]);

	// Sync content with form when it changes
	useEffect(() => {
		form.setValue("content", content);
	}, [content, form]);

	// Auto-generate slug from title
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const title = form.watch("title");
		if (title && !initialData) {
			const slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			form.setValue("slug", slug);
		}
	}, [form.watch("title"), form, initialData]);

	const fetchCategories = async () => {
		try {
			const response = await fetch("/api/admin/categories");
			if (response.ok) {
				const data = await response.json();
				setCategories(data);
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		}
	};

	const fetchTags = async () => {
		try {
			const response = await fetch("/api/admin/tags");
			if (response.ok) {
				const data = await response.json();
				setTags(data);
			}
		} catch (error) {
			console.error("Failed to fetch tags:", error);
		}
	};

	const handleCategoryToggle = (categoryId: string) => {
		const newSelected = selectedCategories.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];

		setSelectedCategories(newSelected);
		form.setValue("categoryIds", newSelected);
		form.trigger("categoryIds"); // Trigger validation
	};

	const handleTagToggle = (tagId: string) => {
		const newSelected = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];

		setSelectedTags(newSelected);
		form.setValue("tagIds", newSelected);
		form.trigger("tagIds"); // Trigger validation
	};

	const onSubmit = async (data: PostEditorInput) => {
		try {
			// Update form with current content and selections
			const submitData = {
				...data,
				content,
				categoryIds: selectedCategories,
				tagIds: selectedTags,
			};

			await onSave(submitData);
		} catch (error) {
			console.error("Post submission error:", error);
			toast.error("Failed to save post");
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{initialData ? "Edit Post" : "Create New Post"}
					</h1>
					<p className="text-muted-foreground">
						{initialData
							? "Update your blog post"
							: "Write and publish a new blog post"}
					</p>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" form="post-form" disabled={isLoading}>
						{isLoading ? (
							<>
								<div className="animate-spin h-4 w-4 border-b-2 border-gray-900 mr-2" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								{initialData ? "Update" : "Create"} Post
							</>
						)}
					</Button>
				</div>
			</div>

			<Form {...form}>
				<form
					id="post-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Post Content</CardTitle>
									<CardDescription>
										Write your blog post content using Markdown syntax
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input placeholder="Enter post title..." {...field} />
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
													<Input placeholder="post-url-slug" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="excerpt"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Excerpt (Optional)</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Brief description of the post..."
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="content"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<div className="mt-2" data-color-mode="light">
														<MDEditor
															value={content}
															onChange={(val) => {
																const newContent = val || "";
																setContent(newContent);
																field.onChange(newContent);
															}}
															preview="edit"
															hideToolbar={false}
															height={400}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Publish Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Publish Settings</CardTitle>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="published"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
												<div className="space-y-0.5">
													<FormLabel>Published</FormLabel>
													<div className="text-sm text-muted-foreground">
														Make this post visible to readers
													</div>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Categories */}
							<Card>
								<CardHeader>
									<CardTitle>Categories</CardTitle>
									<CardDescription>
										Select categories for this post
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{categories.map((category) => (
											<div
												key={category.id}
												className={`p-2 rounded border cursor-pointer transition-colors ${
													selectedCategories.includes(category.id)
														? "bg-primary/10 border-primary"
														: "bg-muted/50 border-border hover:bg-muted"
												}`}
												onClick={() => handleCategoryToggle(category.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleCategoryToggle(category.id);
													}
												}}
											>
												<div className="text-sm font-medium">
													{category.name}
												</div>
											</div>
										))}
										{categories.length === 0 && (
											<p className="text-sm text-muted-foreground">
												No categories available. Create some categories first.
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Tags */}
							<Card>
								<CardHeader>
									<CardTitle>Tags</CardTitle>
									<CardDescription>Select tags for this post</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{tags.map((tag) => (
											<Badge
												key={tag.id}
												variant={
													selectedTags.includes(tag.id) ? "default" : "outline"
												}
												className="cursor-pointer"
												onClick={() => handleTagToggle(tag.id)}
											>
												{tag.name}
											</Badge>
										))}
										{tags.length === 0 && (
											<p className="text-sm text-muted-foreground">
												No tags available. Create some tags first.
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
