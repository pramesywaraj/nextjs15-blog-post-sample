"use client";

import PostEditor from "@/components/blog/post-editor";
import { useNewPost } from "./hooks";

export default function NewPostPage() {
	const { isLoading, handleSave, handleCancel } = useNewPost();

	return (
		<PostEditor
			onSave={handleSave}
			onCancel={handleCancel}
			isLoading={isLoading}
		/>
	);
}
