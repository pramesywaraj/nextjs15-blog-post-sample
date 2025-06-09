import { auth } from "@/auth";
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
import { prisma } from "@/lib/prisma";
import { ArrowRight, CalendarDays, Edit } from "lucide-react";
import Link from "next/link";

async function getRecentPosts() {
	try {
		const posts = await prisma.post.findMany({
			where: { published: true },
			include: {
				author: {
					select: {
						name: true,
						image: true,
					},
				},
				categories: true,
				_count: {
					select: {
						tags: true,
					},
				},
			},
			orderBy: { publishedAt: "desc" },
			take: 6,
		});
		return posts;
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
}

export default async function HomePage() {
	const session = await auth();
	const posts = await getRecentPosts();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
							Modern Blog
						</h1>
					</div>
					<nav className="flex items-center space-x-4">
						<Link
							href="/blog"
							className="text-slate-600 hover:text-slate-900 transition-colors"
						>
							All Posts
						</Link>
						{session?.user?.role === "ADMIN" ? (
							<Link href="/dashboard">
								<Button size="sm">
									<Edit className="w-4 h-4 mr-2" />
									Dashboard
								</Button>
							</Link>
						) : (
							<Link href="/auth/signin">
								<Button size="sm" variant="outline">
									Sign In
								</Button>
							</Link>
						)}
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
						Welcome to Our Blog
					</h2>
					<p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
						Discover insights, stories, and ideas that matter. Stay updated with
						our latest articles covering technology, design, and innovation.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/blog">
							<Button size="lg" className="w-full sm:w-auto">
								Explore Articles
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</Link>
						{!session && (
							<Link href="/auth/signup">
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto"
								>
									Join as Writer
								</Button>
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Recent Posts */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h3 className="text-3xl font-bold mb-4">Latest Articles</h3>
						<p className="text-slate-600 max-w-2xl mx-auto">
							Stay up to date with our newest posts and insights
						</p>
					</div>

					{posts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post) => (
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
														? new Date(post.publishedAt).toLocaleDateString()
														: new Date(post.createdAt).toLocaleDateString()}
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
												<Badge
													key={category.id}
													variant="secondary"
													className="text-xs"
												>
													{category.name}
												</Badge>
											))}
											{post._count.tags > 0 && (
												<Badge variant="outline" className="text-xs">
													+{post._count.tags} tags
												</Badge>
											)}
										</div>
										<Link href={`/blog/${post.slug}`}>
											<Button variant="ghost" size="sm" className="w-full">
												Read More
												<ArrowRight className="w-4 h-4 ml-2" />
											</Button>
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-slate-600 mb-4">No posts published yet.</p>
							{session?.user?.role === "ADMIN" && (
								<Link href="/dashboard/posts/new">
									<Button>Create Your First Post</Button>
								</Link>
							)}
						</div>
					)}

					{posts.length > 0 && (
						<div className="text-center mt-12">
							<Link href="/blog">
								<Button variant="outline" size="lg">
									View All Posts
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-900 text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<h4 className="text-xl font-bold mb-4">Modern Blog</h4>
							<p className="text-slate-400">
								A platform for sharing insights, stories, and ideas that inspire
								and inform.
							</p>
						</div>
						<div>
							<h5 className="font-semibold mb-4">Quick Links</h5>
							<ul className="space-y-2 text-slate-400">
								<li>
									<Link
										href="/blog"
										className="hover:text-white transition-colors"
									>
										All Posts
									</Link>
								</li>
								<li>
									<Link
										href="/blog"
										className="hover:text-white transition-colors"
									>
										Categories
									</Link>
								</li>
								<li>
									<Link
										href="/auth/signin"
										className="hover:text-white transition-colors"
									>
										Admin
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="font-semibold mb-4">Contact</h5>
							<p className="text-slate-400">
								Built with Next.js 15, Prisma, and shadcn/ui
							</p>
						</div>
					</div>
					<div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
						<p>&copy; 2024 Modern Blog. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
