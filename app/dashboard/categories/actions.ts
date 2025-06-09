import type { Category } from "./types";
import type { CategoryInput } from "./validation";

export const fetchCategories = async (): Promise<Category[]> => {
	const response = await fetch("/api/admin/categories");
	if (!response.ok) throw new Error("Failed to fetch categories");
	return response.json();
};

export const createCategory = async (
	data: CategoryInput,
): Promise<Category> => {
	const response = await fetch("/api/admin/categories", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create category");
	}

	return response.json();
};

export const updateCategory = async (
	id: string,
	data: CategoryInput,
): Promise<Category> => {
	const response = await fetch(`/api/admin/categories/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update category");
	}

	return response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
	const response = await fetch(`/api/admin/categories/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Failed to delete category");
};
