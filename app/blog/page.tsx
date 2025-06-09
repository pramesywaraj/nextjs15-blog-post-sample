import { Suspense } from "react";
import {
	BlogHeader,
	CategoriesSidebar,
	EmptyState,
	PostCard,
	SearchForm,
} from "./components";
import { getBlogPageData } from "./services";
import { generatePageDescription } from "./utils";

export default async function BlogPage() {
	const { posts, categories } = await getBlogPageData();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			<BlogHeader />

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<aside className="lg:col-span-1">
						<div className="sticky top-24 space-y-6">
							{/* Search */}
							<Suspense fallback={<div>Loading search...</div>}>
								<SearchForm />
							</Suspense>

							{/* Categories */}
							<CategoriesSidebar
								categories={categories}
								totalPosts={posts.length}
							/>
						</div>
					</aside>

					{/* Main Content */}
					<main className="lg:col-span-3">
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-slate-900 mb-2">
								Latest Articles
							</h2>
							<p className="text-slate-600">
								{generatePageDescription(posts.length)}
							</p>
						</div>

						{posts.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{posts.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
							</div>
						) : (
							<EmptyState />
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
