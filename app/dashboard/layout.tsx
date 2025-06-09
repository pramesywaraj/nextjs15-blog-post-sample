import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session || session.user.role !== "ADMIN") {
		redirect("/auth/signin");
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			<DashboardSidebar />
			<div className="flex-1 flex flex-col">
				<DashboardHeader user={session.user} />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
