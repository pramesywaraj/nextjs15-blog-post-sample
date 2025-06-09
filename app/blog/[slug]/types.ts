export interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	published: boolean;
	createdAt: Date;
	updatedAt: Date;
	author: {
		name: string | null;
		email: string | null;
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

export interface StructuredData {
	"@context": string;
	"@type": string;
	headline: string;
	description: string;
	url: string;
	datePublished: string;
	dateModified: string;
	author: {
		"@type": string;
		name: string;
		url: string;
	};
	publisher: {
		"@type": string;
		name: string;
		url: string;
	};
	mainEntityOfPage: {
		"@type": string;
		"@id": string;
	};
	keywords: string;
	articleSection: string;
	wordCount: number;
	inLanguage: string;
}

export interface AuthorBioProps {
	author: BlogPost["author"];
}

export interface PostMetaProps {
	author: BlogPost["author"];
	createdAt: Date;
	readingTime: number;
}
