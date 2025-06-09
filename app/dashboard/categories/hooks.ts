import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Category } from "./types";
import {
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from "./actions";
import { CategorySchema, type CategoryInput } from "./validation";

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<CategoryInput>({
		resolver: zodResolver(CategorySchema),
		defaultValues: {
			name: "",
			description: "",
			slug: "",
		},
	});

	// Fetch categories on mount
	useEffect(() => {
		loadCategories();
	}, []);

	// Auto-generate slug from name
	useEffect(() => {
		const name = form.watch("name");
		if (name && !editingCategory) {
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			form.setValue("slug", slug);
		}
	}, [form, editingCategory]);

	const loadCategories = async () => {
		try {
			const data = await fetchCategories();
			setCategories(data);
		} catch {
			toast.error("Failed to load categories");
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (data: CategoryInput) => {
		setSubmitting(true);
		try {
			const newCategory = await createCategory(data);
			setCategories([...categories, newCategory]);
			setDialogOpen(false);
			form.reset();
			toast.success("Category created successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create category",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = async (data: CategoryInput) => {
		if (!editingCategory) return;

		setSubmitting(true);
		try {
			const updatedCategory = await updateCategory(editingCategory.id, data);
			setCategories(
				categories.map((cat) =>
					cat.id === editingCategory.id ? updatedCategory : cat,
				),
			);
			setDialogOpen(false);
			setEditingCategory(null);
			form.reset();
			toast.success("Category updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update category",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this category? This action cannot be undone.",
			)
		)
			return;

		try {
			await deleteCategory(id);
			setCategories(categories.filter((cat) => cat.id !== id));
			toast.success("Category deleted successfully");
		} catch {
			toast.error("Failed to delete category");
		}
	};

	const openEditDialog = (category: Category) => {
		setEditingCategory(category);
		form.reset({
			name: category.name,
			description: category.description || "",
			slug: category.slug,
		});
		setDialogOpen(true);
	};

	const openCreateDialog = () => {
		setEditingCategory(null);
		form.reset();
		setDialogOpen(true);
	};

	// Filtered categories based on search term
	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Utility function to format dates
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Stats calculations
	const stats = {
		totalCategories: categories.length,
		categoriesInUse: categories.filter((cat) => cat._count.posts > 0).length,
		unusedCategories: categories.filter((cat) => cat._count.posts === 0).length,
	};

	return {
		// State
		categories,
		loading,
		searchTerm,
		dialogOpen,
		editingCategory,
		submitting,
		filteredCategories,
		stats,

		// Form
		form,

		// Actions
		setSearchTerm,
		setDialogOpen,
		handleCreate,
		handleUpdate,
		handleDelete,
		openEditDialog,
		openCreateDialog,

		// Utilities
		formatDate,
	};
};
