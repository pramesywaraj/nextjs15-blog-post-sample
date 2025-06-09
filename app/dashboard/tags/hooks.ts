import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { TagDetails } from "./types";
import { fetchTags, createTag, updateTag, deleteTag } from "./actions";
import { TagSchema, type TagInput } from "./validation";

export const useTags = () => {
	const [tags, setTags] = useState<TagDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<TagDetails | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<TagInput>({
		resolver: zodResolver(TagSchema),
		defaultValues: {
			name: "",
			slug: "",
		},
	});

	const loadTags = async () => {
		try {
			const data = await fetchTags();
			setTags(data);
		} catch {
			toast.error("Failed to load tags");
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (data: TagInput) => {
		setSubmitting(true);
		try {
			const newTag = await createTag(data);
			setTags([...tags, newTag]);
			setDialogOpen(false);
			form.reset();
			toast.success("Tag created successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create tag",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = async (data: TagInput) => {
		if (!editingTag) return;

		setSubmitting(true);
		try {
			const updatedTag = await updateTag(editingTag.id, data);
			setTags(tags.map((tag) => (tag.id === editingTag.id ? updatedTag : tag)));
			setDialogOpen(false);
			setEditingTag(null);
			form.reset();
			toast.success("Tag updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update tag",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this tag? This action cannot be undone.",
			)
		)
			return;

		try {
			await deleteTag(id);
			setTags(tags.filter((tag) => tag.id !== id));
			toast.success("Tag deleted successfully");
		} catch {
			toast.error("Failed to delete tag");
		}
	};

	const openEditDialog = (tag: TagDetails) => {
		setEditingTag(tag);
		form.reset({
			name: tag.name,
			slug: tag.slug,
		});
		setDialogOpen(true);
	};

	const openCreateDialog = () => {
		setEditingTag(null);
		form.reset();
		setDialogOpen(true);
	};

	// Filtered tags based on search term
	const filteredTags = tags.filter(
		(tag) =>
			tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tag.slug.toLowerCase().includes(searchTerm.toLowerCase()),
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
		totalTags: tags.length,
		tagsInUse: tags.filter((tag) => tag._count.posts > 0).length,
		unusedTags: tags.filter((tag) => tag._count.posts === 0).length,
	};

	// Fetch tags on mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadTags();
	}, []);

	// Auto-generate slug from name
	useEffect(() => {
		const name = form.watch("name");
		if (name && !editingTag) {
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			form.setValue("slug", slug);
		}
	}, [form, editingTag]);

	return {
		// State
		tags,
		loading,
		searchTerm,
		dialogOpen,
		editingTag,
		submitting,
		filteredTags,
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
