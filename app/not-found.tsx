import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileText } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
			<div className="max-w-2xl mx-auto text-center">
				<Card className="border-0 shadow-xl">
					<CardContent className="p-12">
						{/* 404 Illustration */}
						<div className="mb-8">
							<div className="text-8xl font-bold bg-gradient-to-r from-slate-600 to-slate-900 bg-clip-text text-transparent mb-4">
								404
							</div>
							<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
						</div>

						{/* Error Message */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-slate-900 mb-4">
								Page Not Found
							</h1>
							<p className="text-lg text-slate-600 mb-2">
								Sorry, we couldn&apos;t find the page you&apos;re looking for.
							</p>
							<p className="text-slate-500">
								The page might have been moved, deleted, or the URL might be
								incorrect.
							</p>
						</div>

						{/* Navigation Options */}
						<div className="space-y-4 mb-8">
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/">
									<Button size="lg" className="w-full sm:w-auto">
										<Home className="mr-2 h-5 w-5" />
										Go Home
									</Button>
								</Link>
								<Link href="/blog">
									<Button
										variant="outline"
										size="lg"
										className="w-full sm:w-auto"
									>
										<FileText className="mr-2 h-5 w-5" />
										Browse Blog
									</Button>
								</Link>
							</div>

							<Button
								variant="ghost"
								size="lg"
								// onClick={() => window.history.back()}
								className="w-full sm:w-auto"
							>
								<ArrowLeft className="mr-2 h-5 w-5" />
								Go Back
							</Button>
						</div>

						{/* Helpful Links */}
						<div className="border-t border-slate-200 pt-8">
							<h3 className="text-lg font-semibold text-slate-900 mb-4">
								Popular Pages
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
								<Link
									href="/blog"
									className="text-slate-600 hover:text-slate-900 transition-colors"
								>
									📚 All Blog Posts
								</Link>
								<Link
									href="/about"
									className="text-slate-600 hover:text-slate-900 transition-colors"
								>
									👋 About Us
								</Link>
								<Link
									href="/contact"
									className="text-slate-600 hover:text-slate-900 transition-colors"
								>
									📧 Contact
								</Link>
								<Link
									href="/auth/signin"
									className="text-slate-600 hover:text-slate-900 transition-colors"
								>
									🔐 Admin Login
								</Link>
							</div>
						</div>

						{/* Search Suggestion */}
						<div className="mt-8 p-4 bg-slate-50 rounded-lg">
							<div className="flex items-center justify-center text-slate-600">
								<Search className="mr-2 h-4 w-4" />
								<span className="text-sm">
									Looking for something specific? Try browsing our blog
									categories.
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-sm text-slate-500">
						If you believe this is an error, please{" "}
						<Link
							href="/contact"
							className="text-blue-600 hover:text-blue-800 underline"
						>
							contact support
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
