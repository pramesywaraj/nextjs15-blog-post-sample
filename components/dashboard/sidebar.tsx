"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	FileText,
	FolderOpen,
	Tags,
	Settings,
	Home,
	Plus,
} from "lucide-react";

const sidebarItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Posts",
		href: "/dashboard/posts",
		icon: FileText,
	},
	{
		title: "Categories",
		href: "/dashboard/categories",
		icon: FolderOpen,
	},
	{
		title: "Tags",
		href: "/dashboard/tags",
		icon: Tags,
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
];

export function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<div className="w-64 bg-white border-r border-slate-200 flex flex-col">
			<div className="p-6 border-b border-slate-200">
				<Link href="/" className="flex items-center space-x-2">
					<h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
						Modern Blog
					</h2>
				</Link>
				<p className="text-sm text-slate-600 mt-1">Admin Dashboard</p>
			</div>

			<nav className="flex-1 p-4 space-y-2">
				<div className="mb-4">
					<Link href="/dashboard/posts/new">
						<Button className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							New Post
						</Button>
					</Link>
				</div>

				{sidebarItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href));

					return (
						<Link key={item.href} href={item.href}>
							<Button
								variant={isActive ? "secondary" : "ghost"}
								className={cn(
									"w-full justify-start",
									isActive && "bg-slate-100",
								)}
							>
								<item.icon className="w-4 h-4 mr-2" />
								{item.title}
							</Button>
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-slate-200">
				<Link href="/">
					<Button variant="outline" className="w-full">
						<Home className="w-4 h-4 mr-2" />
						View Site
					</Button>
				</Link>
			</div>
		</div>
	);
}
