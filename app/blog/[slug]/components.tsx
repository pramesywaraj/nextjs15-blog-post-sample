import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { AuthorBioProps, BlogPost, PostMetaProps } from "./types";
import { formatPublishDate, getAuthorInitial } from "./utils";

export function PostHeader({ post }: { post: BlogPost }) {
	return (
		<header className="mb-8 text-center">
			<div className="mb-4">
				{post.categories.map((category) => (
					<Link
						key={category.id}
						href={`/blog/category/${category.slug}`}
						className="no-underline"
					>
						<Badge variant="secondary" className="mr-2">
							{category.name}
						</Badge>
					</Link>
				))}
			</div>

			<h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
				{post.title}
			</h1>

			{post.excerpt && (
				<p className="text-xl text-gray-600 mb-6 leading-relaxed">
					{post.excerpt}
				</p>
			)}
		</header>
	);
}

export function PostMeta({ author, createdAt, readingTime }: PostMetaProps) {
	return (
		<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-8">
			<div className="flex items-center">
				<User className="mr-2 h-4 w-4" />
				<span>{author.name || "Anonymous"}</span>
			</div>
			<div className="flex items-center">
				<CalendarDays className="mr-2 h-4 w-4" />
				<time dateTime={createdAt.toISOString()}>
					{formatPublishDate(createdAt)}
				</time>
			</div>
			<div className="flex items-center">
				<Clock className="mr-2 h-4 w-4" />
				<span>{readingTime} min read</span>
			</div>
		</div>
	);
}

export function ArticleContentHTML({ content }: { content: string }) {
	return <div className="prose prose-lg max-w-none mb-8 document-prose" dangerouslySetInnerHTML={{ __html: content }} />
}

export function ArticleContent({ content }: { content: string }) {
	return (
		<div className="prose prose-lg max-w-none mb-8">
			<ReactMarkdown
				components={{
					code(props) {
						const { className, children, ...rest } = props;
						const match = /language-(\w+)/.exec(className || "");
						const isInline = !match;
						return !isInline ? (
							<SyntaxHighlighter
								// @ts-expect-error - react-syntax-highlighter type issue
								style={tomorrow}
								language={match[1]}
								PreTag="div"
								{...rest}
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className={className} {...rest}>
								{children}
							</code>
						);
					},
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900">
							{children}
						</h3>
					),
					p: ({ children }) => (
						<p className="text-gray-700 leading-relaxed mb-4">{children}</p>
					),
					a: ({ href, children }) => (
						<a
							href={href}
							className="text-blue-600 hover:text-blue-800 underline"
							target={href?.startsWith("http") ? "_blank" : undefined}
							rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
						>
							{children}
						</a>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic bg-blue-50 rounded-r">
							{children}
						</blockquote>
					),
					ul: ({ children }) => (
						<ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal list-inside mb-4 space-y-1">
							{children}
						</ol>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}

export function PostTags({ tags }: { tags: BlogPost["tags"] }) {
	if (tags.length === 0) return null;

	return (
		<div className="border-t border-gray-200 pt-6 mb-8">
			<div className="flex items-center gap-2 flex-wrap">
				<Tag className="h-4 w-4 text-gray-500" />
				<span className="text-sm font-medium text-gray-700">Tags:</span>
				{tags.map((tag) => (
					<Link
						key={tag.id}
						href={`/blog/tag/${tag.slug}`}
						className="no-underline"
					>
						<Badge variant="outline" className="hover:bg-gray-100">
							{tag.name}
						</Badge>
					</Link>
				))}
			</div>
		</div>
	);
}

export function AuthorBio({ author }: AuthorBioProps) {
	return (
		<Card className="mt-8">
			<CardContent className="p-6">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
						{getAuthorInitial(author.name)}
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">
							{author.name || "Anonymous"}
						</h3>
						<p className="text-gray-600 text-sm">Author and content creator</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function BackToBlogButton() {
	return (
		<div className="mb-8">
			<Link href="/blog">
				<Button
					variant="ghost"
					className="text-muted-foreground hover:text-foreground"
				>
					<span className="mr-2">←</span>
					Back to Blog
				</Button>
			</Link>
		</div>
	);
}

export function MoreArticlesButton() {
	return (
		<div className="mt-12 text-center">
			<Link href="/blog">
				<Button variant="outline" size="lg">
					Read More Articles
				</Button>
			</Link>
		</div>
	);
}
