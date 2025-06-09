"use client";

import PostEditor from "@/components/blog/post-editor";
import { Loader2 } from "lucide-react";
import { useEditPost } from "./hooks";

export default function EditPostPage() {
	const { post, isLoading, isInitialLoading, handleSave, handleCancel } =
		useEditPost();

	if (isInitialLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-slate-600">Loading post...</p>
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-slate-600 mb-4">Post not found</p>
					<button
						type="button"
						onClick={handleCancel}
						className="text-blue-600 hover:text-blue-800"
					>
						Back to Posts
					</button>
				</div>
			</div>
		);
	}

	return (
		<PostEditor
			initialData={post}
			onSave={handleSave}
			onCancel={handleCancel}
			isLoading={isLoading}
		/>
	);
}
