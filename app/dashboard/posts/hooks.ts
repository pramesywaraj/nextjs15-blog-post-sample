import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	deletePost,
	fetchCategories,
	fetchPosts,
	updatePostStatus,
} from "./actions";
import type { Category, PostDetails } from "./types";

export const usePosts = () => {
	const router = useRouter();
	const [posts, setPosts] = useState<PostDetails[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const loadPosts = async () => {
		try {
			const data = await fetchPosts();
			setPosts(data);
		} catch {
			toast.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const loadCategories = async () => {
		try {
			const data = await fetchCategories();
			setCategories(data);
		} catch (error) {
			console.error("Failed to load categories:", error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this post?")) return;

		try {
			await deletePost(id);
			setPosts(posts.filter((post) => post.id !== id));
			toast.success("Post deleted successfully");
		} catch {
			toast.error("Failed to delete post");
		}
	};

	const handleTogglePublish = async (id: string, currentStatus: boolean) => {
		try {
			await updatePostStatus(id, { published: !currentStatus });
			setPosts(
				posts.map((post) =>
					post.id === id ? { ...post, published: !currentStatus } : post,
				),
			);
			toast.success(
				`Post ${!currentStatus ? "published" : "unpublished"} successfully`,
			);
		} catch {
			toast.error("Failed to update post");
		}
	};

	const handleCreatePost = () => {
		router.push("/dashboard/posts/new");
	};

	const handleEditPost = (id: string) => {
		router.push(`/dashboard/posts/${id}/edit`);
	};

	const handleViewPost = (slug: string) => {
		window.open(`/blog/${slug}`, "_blank");
	};

	// Filter posts based on search term, status, and category
	const filteredPosts = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "published" && post.published) ||
			(statusFilter === "draft" && !post.published);
		const matchesCategory =
			categoryFilter === "all" ||
			post.categories.some((cat) => cat.id === categoryFilter);

		return matchesSearch && matchesStatus && matchesCategory;
	});

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
		totalPosts: posts.length,
		publishedPosts: posts.filter((post) => post.published).length,
		draftPosts: posts.filter((post) => !post.published).length,
	};

	// Fetch data on mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadPosts();
		loadCategories();
	}, []);

	return {
		// State
		posts,
		categories,
		loading,
		searchTerm,
		statusFilter,
		categoryFilter,
		filteredPosts,
		stats,

		// Actions
		setSearchTerm,
		setStatusFilter,
		setCategoryFilter,
		handleDelete,
		handleTogglePublish,
		handleCreatePost,
		handleEditPost,
		handleViewPost,

		// Utilities
		formatDate,
	};
};
