"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, MoreVertical, Edit, Trash2, Hash } from "lucide-react";
import { useTags } from "./hooks";

export default function TagsPage() {
	const {
		loading,
		searchTerm,
		dialogOpen,
		editingTag,
		submitting,
		filteredTags,
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
	} = useTags();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p className="text-gray-600">Loading tags...</p>
				</div>
			</div>
		);
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
													{stats.totalTags === 0
														? "No tags found. Create your first tag!"
														: "No tags match your search."}
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
														{tag._count.posts}{" "}
														{tag._count.posts === 1 ? "post" : "posts"}
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
															<DropdownMenuItem
																onClick={() => openEditDialog(tag)}
															>
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
							<div className="text-2xl font-bold">{stats.totalTags}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Tags in Use</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.tagsInUse}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Unused Tags</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.unusedTags}</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
						<DialogDescription>
							{editingTag
								? "Update the tag details below."
								: "Add a new tag to categorize your blog posts."}
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								editingTag ? handleUpdate : handleCreate,
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
											<div className="animate-spin h-4 w-4 border-b-2 border-gray-900 mr-2" />
											{editingTag ? "Updating..." : "Creating..."}
										</>
									) : editingTag ? (
										"Update Tag"
									) : (
										"Create Tag"
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
