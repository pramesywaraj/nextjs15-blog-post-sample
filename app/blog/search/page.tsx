import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
	EmptySearchState,
	NoResultsState,
	PostCard,
	SearchForm,
} from "./components";
import { getSearchResults } from "./services";
import type { SearchPageProps } from "./types";
import { formatCategoryFilterText, formatSearchResultsText } from "./utils";

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const resolvedSearchParams = await searchParams;
	const query = resolvedSearchParams.q || "";
	const category = resolvedSearchParams.category;

	const searchResult = await getSearchResults(query, category);

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
											Found{" "}
											{formatSearchResultsText(searchResult.pagination.total)}
											{formatCategoryFilterText(category)}
										</p>
									)}
								</div>

								{searchResult && searchResult.posts.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{searchResult.posts.map((post) => (
											<PostCard key={post.id} post={post} />
										))}
									</div>
								) : (
									<NoResultsState query={query} />
								)}
							</>
						) : (
							<EmptySearchState />
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
