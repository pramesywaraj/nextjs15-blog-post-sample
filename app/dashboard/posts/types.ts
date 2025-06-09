export interface Category {
	id: string;
	name: string;
	description: string | null;
	slug: string;
	createdAt: string;
	updatedAt: string;
	_count: {
		posts: number;
	};
}

export interface Post {
	id: string;
	title: string;
	content: string;
	excerpt?: string;
	slug: string;
	published: boolean;
	categories: Array<{ id: string; name: string; slug: string }>;
	tags: Array<{ id: string; name: string; slug: string }>;
}

export interface PostDetails {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	published: boolean;
	createdAt: string;
	updatedAt: string;
	author: {
		name: string | null;
		email: string;
	};
	categories: {
		id: string;
		name: string;
	}[];
	_count: {
		tags: number;
	};
}

export interface PostCategory {
	id: string;
	name: string;
}

export interface RecentPost {
	id: string;
	title: string;
	slug: string;
	published: boolean;
	createdAt: Date;
	categories: PostCategory[];
}
