export interface SearchParams {
	q?: string;
	category?: string;
}

export interface SearchPageProps {
	searchParams: Promise<SearchParams>;
}

export interface Post {
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

export interface SearchFormProps {
	initialQuery?: string;
	initialCategory?: string;
}
