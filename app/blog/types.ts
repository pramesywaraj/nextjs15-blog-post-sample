export interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export interface PostCategory {
	id: string;
	name: string;
	slug: string;
}

export interface PostTag {
	id: string;
	name: string;
	slug: string;
}

export interface PostAuthor {
	name: string | null;
	email: string;
	image: string | null;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	publishedAt: Date | null;
	createdAt: Date;
	author: {
		name: string | null;
		image: string | null;
	};
	categories: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
	tags: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
}

export interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export interface SearchParams {
	q?: string;
	category?: string;
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

export interface Category {
	id: string;
	name: string;
	slug: string;
	_count: {
		posts: number;
	};
}

export interface BlogPageData {
	posts: BlogPost[];
	categories: Category[];
}

export interface PostCardProps {
	post: BlogPost;
}

export interface CategoriesSidebarProps {
	categories: Category[];
	totalPosts: number;
}
