import type { TagDetails } from "./types";
import type { TagInput } from "./validation";

export const fetchTags = async (): Promise<TagDetails[]> => {
	const response = await fetch("/api/admin/tags");
	if (!response.ok) throw new Error("Failed to fetch tags");
	return response.json();
};

export const createTag = async (data: TagInput): Promise<TagDetails> => {
	const response = await fetch("/api/admin/tags", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create tag");
	}

	return response.json();
};

export const updateTag = async (
	id: string,
	data: TagInput,
): Promise<TagDetails> => {
	const response = await fetch(`/api/admin/tags/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update tag");
	}

	return response.json();
};

export const deleteTag = async (id: string): Promise<void> => {
	const response = await fetch(`/api/admin/tags/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Failed to delete tag");
};
