"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Eye,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { usePosts } from "./hooks";

export default function PostsPage() {
	const {
		loading,
		searchTerm,
		statusFilter,
		categoryFilter,
		filteredPosts,
		categories,
		stats,
		setSearchTerm,
		setStatusFilter,
		setCategoryFilter,
		handleDelete,
		handleTogglePublish,
		handleCreatePost,
		handleEditPost,
		handleViewPost,
		formatDate,
	} = usePosts();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p className="text-gray-600">Loading posts...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Posts</h1>
					<p className="text-muted-foreground">
						Manage your blog posts and content
					</p>
				</div>
				<Button onClick={handleCreatePost}>
					<Plus className="mr-2 h-4 w-4" />
					New Post
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Posts</CardTitle>
					<CardDescription>
						A list of all your blog posts with their status and details
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search posts..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="published">Published</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
							</SelectContent>
						</Select>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category.id} value={category.id}>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Posts Table */}
					<div className="w-full overflow-x-auto">
						<div className="rounded-md border min-w-full">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Tags</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredPosts.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-8">
												<div className="text-muted-foreground">
													{stats.totalPosts === 0
														? "No posts found. Create your first post!"
														: "No posts match your filters."}
												</div>
											</TableCell>
										</TableRow>
									) : (
										filteredPosts.map((post) => (
											<TableRow key={post.id}>
												<TableCell>
													<div>
														<div className="font-medium truncate">
															{post.title}
														</div>
														{post.excerpt && (
															<div className="text-sm text-muted-foreground overflow-hidden">
																{post.excerpt.length > 50
																	? `${post.excerpt.substring(0, 100)}...`
																	: post.excerpt}
															</div>
														)}
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant={post.published ? "default" : "secondary"}
													>
														{post.published ? "Published" : "Draft"}
													</Badge>
												</TableCell>
												<TableCell>
													{post.categories.length > 0 ? (
														<div className="flex flex-wrap gap-1">
															{post.categories.map((category) => (
																<Badge key={category.id} variant="outline">
																	{category.name}
																</Badge>
															))}
														</div>
													) : (
														<span className="text-muted-foreground">
															No categories
														</span>
													)}
												</TableCell>
												<TableCell>
													<span className="text-sm text-muted-foreground">
														{post._count.tags}{" "}
														{post._count.tags === 1 ? "tag" : "tags"}
													</span>
												</TableCell>
												<TableCell className="text-sm text-muted-foreground">
													{formatDate(post.createdAt)}
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" className="h-8 w-8 p-0">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleViewPost(post.slug)}
															>
																<Eye className="mr-2 h-4 w-4" />
																View
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleEditPost(post.id)}
															>
																<Pencil className="mr-2 h-4 w-4" />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleTogglePublish(post.id, post.published)
																}
															>
																{post.published ? "Unpublish" : "Publish"}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleDelete(post.id)}
																className="text-red-600"
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
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
