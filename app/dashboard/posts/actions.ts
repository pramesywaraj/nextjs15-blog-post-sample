import type { PostDetails, Category, Post } from "./types";
import type { PostUpdate } from "./validation";
import type { PostInput } from "@/lib/validations";

export const fetchPosts = async (): Promise<PostDetails[]> => {
	const response = await fetch("/api/admin/posts");
	if (!response.ok) throw new Error("Failed to fetch posts");
	return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
	const response = await fetch("/api/admin/categories");
	if (!response.ok) throw new Error("Failed to fetch categories");
	return response.json();
};

export const deletePost = async (id: string): Promise<void> => {
	const response = await fetch(`/api/admin/posts/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Failed to delete post");
};

export const updatePostStatus = async (
	id: string,
	data: PostUpdate,
): Promise<PostDetails> => {
	const response = await fetch(`/api/admin/posts/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) throw new Error("Failed to update post");
	return response.json();
};

export const createPost = async (data: PostInput): Promise<PostDetails> => {
	const response = await fetch("/api/admin/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const responseData = await response.json();

	if (!response.ok) {
		throw new Error(
			responseData.message || responseData.error || "Failed to create post",
		);
	}

	return responseData;
};

export const fetchPost = async (id: string): Promise<Post> => {
	const response = await fetch(`/api/admin/posts/${id}`);

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error("Post not found");
		}
		throw new Error("Failed to fetch post");
	}

	return response.json();
};

export const updatePost = async (
	id: string,
	data: PostInput,
): Promise<Post> => {
	const response = await fetch(`/api/admin/posts/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const responseData = await response.json();

	if (!response.ok) {
		throw new Error(responseData.error || "Failed to update post");
	}

	return responseData;
};
