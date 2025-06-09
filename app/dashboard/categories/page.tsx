"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useCategories } from "./hooks";

export default function CategoriesPage() {
	const {
		loading,
		searchTerm,
		dialogOpen,
		editingCategory,
		submitting,
		filteredCategories,
		stats,
		form,
		setSearchTerm,
		setDialogOpen,
		handleCreate,
		handleUpdate,
		handleDelete,
		openEditDialog,
		openCreateDialog,
		formatDate,
	} = useCategories();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p className="text-gray-600">Loading categories...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
					<p className="text-muted-foreground">
						Organize your blog posts with categories
					</p>
				</div>
				<Button onClick={openCreateDialog}>
					<Plus className="mr-2 h-4 w-4" />
					New Category
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Categories</CardTitle>
					<CardDescription>
						Manage your blog categories and organize your content
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="relative mb-6">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search categories..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Categories Table */}
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
								{filteredCategories.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<div className="text-muted-foreground">
												{stats.totalCategories === 0
													? "No categories found. Create your first category!"
													: "No categories match your search."}
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredCategories.map((category) => (
										<TableRow key={category.id}>
											<TableCell>
												<div>
													<div className="font-medium">{category.name}</div>
													{category.description && (
														<div className="text-sm text-muted-foreground line-clamp-1">
															{category.description}
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{category.slug}</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="secondary">
													{category._count.posts}{" "}
													{category._count.posts === 1 ? "post" : "posts"}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{formatDate(category.createdAt)}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => openEditDialog(category)}
														>
															<Edit className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDelete(category.id)}
															className="text-red-600"
															disabled={category._count.posts > 0}
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

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							{editingCategory ? "Edit Category" : "Create Category"}
						</DialogTitle>
						<DialogDescription>
							{editingCategory
								? "Update the category details below."
								: "Add a new category to organize your blog posts."}
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								editingCategory ? handleUpdate : handleCreate,
							)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Technology" {...field} />
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
											<Input placeholder="technology" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Brief description of this category..."
												{...field}
											/>
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
											<div className="animate-spin h-4 w-4 border-b-2 border-gray-900 mr-2" />
											{editingCategory ? "Updating..." : "Creating..."}
										</>
									) : editingCategory ? (
										"Update Category"
									) : (
										"Create Category"
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
