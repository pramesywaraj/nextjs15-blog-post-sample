import type { PostInput } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPost } from "../actions";

export const useNewPost = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (data: PostInput) => {
		setIsLoading(true);
		try {
			await createPost(data);
			toast.success("Post created successfully!");
			router.push("/dashboard/posts");
		} catch (error) {
			console.error("Save error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create post",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		router.push("/dashboard/posts");
	};

	return {
		isLoading,
		handleSave,
		handleCancel,
	};
};
