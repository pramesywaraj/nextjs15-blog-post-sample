export interface TagDetails {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	_count: {
		posts: number;
	};
}
