import type { PostInput } from "@/lib/validations";

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export interface Tag {
	id: string;
	name: string;
	slug: string;
}

export interface PostData {
	id?: string;
	title: string;
	content: string;
	excerpt?: string;
	slug: string;
	published: boolean;
	categories?: Category[];
	tags?: Tag[];
}

export interface PostEditorProps {
	initialData?: PostData;
	onSave: (data: PostInput) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

export interface Post {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	publishedAt: string | null;
	createdAt: string;
	author: {
		name: string | null;
		image: string | null;
	};
	categories: {
		id: string;
		name: string;
		slug: string;
	}[];
	tags: {
		id: string;
		name: string;
		slug: string;
	}[];
}

export interface SearchResult {
	posts: Post[];
	pagination: {
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	};
	query: string;
	category?: string;
}

export interface SearchPostsProps {
	initialPosts: Post[];
	categories: Array<{
		id: string;
		name: string;
		slug: string;
		_count: { posts: number };
	}>;
}
