"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInUser } from "./actions";
import type { SignInPageState } from "./types";
import { type SignInInput, SignInSchema } from "./validation";

export const useSignIn = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, setState] = useState<SignInPageState>({
		isLoading: false,
		error: null,
	});

	const form = useForm<SignInInput>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (data: SignInInput) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await signInUser(data);
			if (result?.error) {
				setState((prev) => ({ ...prev, error: "Invalid email or password" }));
			} else {
				const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
				router.push(callbackUrl);
				router.refresh();
			}
		} catch {
			setState((prev) => ({
				...prev,
				error: "An error occurred. Please try again.",
			}));
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	return {
		form,
		isLoading: state.isLoading,
		error: state.error,
		handleSubmit,
	};
};
