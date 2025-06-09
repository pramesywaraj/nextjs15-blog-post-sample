import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CalendarDays, Search, X } from "lucide-react";
import { Suspense } from "react";
import type { SearchParams, Post } from "../types";

async function searchPosts(query: string, category?: string) {
	try {
		const params = new URLSearchParams();
		params.set("q", query);
		if (category && category !== "all") {
			params.set("category", category);
		}

		const baseUrl =
			process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000";

		const response = await fetch(
			`${baseUrl}/api/blog/search?${params.toString()}`,
			{
				cache: "no-store",
			},
		);

		if (!response.ok) {
			throw new Error("Search failed");
		}

		return await response.json();
	} catch (error) {
		console.error("Search error:", error);
		return {
			posts: [],
			pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
			query,
			category,
		};
	}
}

function SearchForm({
	initialQuery,
}: { initialQuery?: string; initialCategory?: string }) {
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

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const resolvedSearchParams = await searchParams;
	const query = resolvedSearchParams.q || "";
	const category = resolvedSearchParams.category;

	const searchResult = query ? await searchPosts(query, category) : null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link href="/blog">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Blog
							</Button>
						</Link>
						<div className="border-l border-slate-200 pl-4">
							<h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
								Search Results
							</h1>
						</div>
					</div>
					<nav className="flex items-center space-x-4">
						<Link href="/auth/signin">
							<Button size="sm" variant="outline">
								Admin
							</Button>
						</Link>
					</nav>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<aside className="lg:col-span-1">
						<div className="sticky top-24">
							<Suspense fallback={<div>Loading search...</div>}>
								<SearchForm initialQuery={query} initialCategory={category} />
							</Suspense>
						</div>
					</aside>

					{/* Main Content */}
					<main className="lg:col-span-3">
						{query ? (
							<>
								<div className="mb-6">
									<h2 className="text-3xl font-bold text-slate-900 mb-2">
										Search Results for &quot;{query}&quot;
									</h2>
									{searchResult && (
										<p className="text-slate-600">
											Found {searchResult.pagination.total}{" "}
											{searchResult.pagination.total === 1
												? "result"
												: "results"}
											{category && category !== "all" && (
												<span> in category &quot;{category}&quot;</span>
											)}
										</p>
									)}
								</div>

								{searchResult && searchResult.posts.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{searchResult.posts.map((post: Post) => (
											<Card
												key={post.id}
												className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
											>
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
																{post.publishedAt
																	? new Date(
																			post.publishedAt,
																		).toLocaleDateString()
																	: new Date(
																			post.createdAt,
																		).toLocaleDateString()}
															</div>
														</div>
													</div>
													<div>
														<CardTitle className="line-clamp-2 hover:text-primary transition-colors">
															<Link href={`/blog/${post.slug}`}>
																{post.title}
															</Link>
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
															<Badge
																key={category.id}
																variant="secondary"
																className="text-xs"
															>
																{category.name}
															</Badge>
														))}
														{post.tags.slice(0, 3).map((tag) => (
															<Badge
																key={tag.id}
																variant="outline"
																className="text-xs"
															>
																{tag.name}
															</Badge>
														))}
													</div>
													<Link href={`/blog/${post.slug}`}>
														<Button
															variant="ghost"
															size="sm"
															className="w-full"
														>
															Read More
														</Button>
													</Link>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<div className="max-w-md mx-auto">
											<Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
											<h3 className="text-xl font-semibold text-slate-900 mb-2">
												No results found
											</h3>
											<p className="text-slate-600 mb-6">
												No articles match your search for &quot;{query}&quot;.
												Try different keywords or browse by category.
											</p>
											<Link href="/blog">
												<Button>
													<ArrowLeft className="w-4 h-4 mr-2" />
													Back to All Posts
												</Button>
											</Link>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12">
								<div className="max-w-md mx-auto">
									<Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-slate-900 mb-2">
										Enter a search query
									</h3>
									<p className="text-slate-600 mb-6">
										Use the search form to find articles by title, content,
										categories, or tags.
									</p>
									<Link href="/blog">
										<Button>
											<ArrowLeft className="w-4 h-4 mr-2" />
											Browse All Posts
										</Button>
									</Link>
								</div>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
