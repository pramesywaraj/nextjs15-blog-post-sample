"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SignInForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<SignInInput>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignInInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid email or password");
			} else {
				const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
				router.push(callbackUrl);
				router.refresh();
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Sign In
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access the admin dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="admin@example.com"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Sign In
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center">
						<p className="text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								href="/auth/signup"
								className="text-primary hover:underline"
							>
								Sign up
							</Link>
						</p>
					</div>

					<div className="mt-4 text-center">
						<Link
							href="/"
							className="text-sm text-muted-foreground hover:underline"
						>
							← Back to Blog
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SignInPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
					<Card className="w-full max-w-md">
						<CardContent className="p-6">
							<div className="flex items-center justify-center">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
						</CardContent>
					</Card>
				</div>
			}
		>
			<SignInForm />
		</Suspense>
	);
}
