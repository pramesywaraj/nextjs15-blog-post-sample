import type { Metadata } from "next";
import {
	ArticleContent,
	AuthorBio,
	BackToBlogButton,
	MoreArticlesButton,
	PostHeader,
	PostMeta,
	PostTags,
} from "./components";
import { getPostBySlug } from "./services";
import type { BlogPostPageProps } from "./types";
import {
	estimateReadingTime,
	generateBlogPostMetadata,
	generateStructuredData,
} from "./utils";

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	try {
		const { slug } = await params;
		const post = await getPostBySlug(slug);
		return generateBlogPostMetadata(post);
	} catch {
		return {
			title: "Post Not Found",
			description: "The requested blog post could not be found.",
		};
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	const readingTime = estimateReadingTime(post.content);
	const structuredData = generateStructuredData(post);

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-4xl mx-auto px-4 py-8">
					<BackToBlogButton />

					<article className="prose prose-lg max-w-none">
						<PostHeader post={post} />
						<PostMeta
							author={post.author}
							createdAt={post.createdAt}
							readingTime={readingTime}
						/>
						<ArticleContent content={post.content} />
						<PostTags tags={post.tags} />
						<AuthorBio author={post.author} />
						<MoreArticlesButton />
					</article>
				</div>
			</div>
		</>
	);
}
