import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Search, X } from "lucide-react";
import Link from "next/link";
import type { Post, SearchFormProps } from "./types";
import { formatPostDate } from "./utils";

export function SearchForm({ initialQuery }: SearchFormProps) {
	return (
		<form action="/blog/search" method="GET">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Search className="h-5 w-5" />
						Search Articles
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
						<input
							type="text"
							name="q"
							defaultValue={initialQuery}
							placeholder="Search posts by title, content, or tags..."
							className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div className="flex gap-2 mt-3">
						<Button type="submit" className="flex-1">
							Search
						</Button>
						<Link href="/blog">
							<Button type="button" variant="outline">
								<X className="w-4 h-4" />
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}

export function PostCard({ post }: { post: Post }) {
	return (
		<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
			<CardHeader className="space-y-4">
				<div className="flex items-center space-x-2">
					<Avatar className="w-8 h-8">
						<AvatarImage src={post.author.image || ""} />
						<AvatarFallback>
							{post.author.name?.charAt(0) || "A"}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm text-slate-600 truncate">
							{post.author.name}
						</p>
						<div className="flex items-center text-xs text-slate-500">
							<CalendarDays className="w-3 h-3 mr-1" />
							{formatPostDate(post.publishedAt, post.createdAt)}
						</div>
					</div>
				</div>
				<div>
					<CardTitle className="line-clamp-2 hover:text-primary transition-colors">
						<Link href={`/blog/${post.slug}`}>{post.title}</Link>
					</CardTitle>
					{post.excerpt && (
						<CardDescription className="mt-2 line-clamp-3">
							{post.excerpt}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex flex-wrap gap-2 mb-4">
					{post.categories.slice(0, 2).map((category) => (
						<Badge key={category.id} variant="secondary" className="text-xs">
							{category.name}
						</Badge>
					))}
					{post.tags.slice(0, 3).map((tag) => (
						<Badge key={tag.id} variant="outline" className="text-xs">
							{tag.name}
						</Badge>
					))}
				</div>
				<Link href={`/blog/${post.slug}`}>
					<Button variant="ghost" size="sm" className="w-full">
						Read More
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

export function NoResultsState({ query }: { query: string }) {
	return (
		<div className="text-center py-12">
			<div className="max-w-md mx-auto">
				<Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-slate-900 mb-2">
					No results found
				</h3>
				<p className="text-slate-600 mb-6">
					No articles match your search for &quot;{query}&quot;. Try different
					keywords or browse by category.
				</p>
				<Link href="/blog">
					<Button>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to All Posts
					</Button>
				</Link>
			</div>
		</div>
	);
}

export function EmptySearchState() {
	return (
		<div className="text-center py-12">
			<div className="max-w-md mx-auto">
				<Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-slate-900 mb-2">
					Enter a search query
				</h3>
				<p className="text-slate-600 mb-6">
					Use the search form to find articles by title, content, categories, or
					tags.
				</p>
				<Link href="/blog">
					<Button>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Browse All Posts
					</Button>
				</Link>
			</div>
		</div>
	);
}
