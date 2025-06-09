import type { PostInput } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchPost, updatePost } from "../../actions";
import type { Post } from "../../types";

export const useEditPost = () => {
	const router = useRouter();
	const params = useParams();
	const postId = params.id as string;

	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const loadPost = async () => {
		try {
			setIsInitialLoading(true);
			const postData = await fetchPost(postId);
			setPost(postData);
		} catch (error) {
			console.error("Error fetching post:", error);
			if (error instanceof Error && error.message === "Post not found") {
				toast.error("Post not found");
			} else {
				toast.error("Failed to load post");
			}
			router.push("/dashboard/posts");
		} finally {
			setIsInitialLoading(false);
		}
	};

	const handleSave = async (data: PostInput) => {
		setIsLoading(true);
		try {
			await updatePost(postId, data);
			toast.success("Post updated successfully!");
			router.push("/dashboard/posts");
		} catch (error) {
			console.error("Update error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to update post",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		router.push("/dashboard/posts");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (postId) {
			loadPost();
		}
	}, [postId]);

	return {
		post,
		isLoading,
		isInitialLoading,
		handleSave,
		handleCancel,
	};
};
