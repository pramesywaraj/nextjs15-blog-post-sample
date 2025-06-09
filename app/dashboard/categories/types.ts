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
