export interface CategoryPageProps {
	params: Promise<{ slug: string }>;
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
		createdAt: Date;
		updatedAt: Date;
		description: string | null;
	}>;
	tags: Array<{
		id: string;
		name: string;
		slug: string;
		createdAt: Date;
		updatedAt: Date;
	}>;
}

export interface CategoryWithPosts {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	posts: BlogPost[];
	_count: {
		posts: number;
	};
}

export interface CategorySummary {
	id: string;
	name: string;
	slug: string;
	_count: {
		posts: number;
	};
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

export interface Tag {
	id: string;
	name: string;
	slug: string;
}
