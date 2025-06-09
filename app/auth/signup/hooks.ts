"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUpUser } from "./actions";
import type { SignUpPageState } from "./types";
import { type SignUpInput, SignUpSchema } from "./validation";

export const useSignUp = () => {
	const router = useRouter();
	const [state, setState] = useState<SignUpPageState>({
		isLoading: false,
		error: null,
	});

	const form = useForm<SignUpInput>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSubmit = async (data: SignUpInput) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			await signUpUser(data);
			toast.success("Account created successfully! Please sign in.");
			router.push("/auth/signin");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred";
			setState((prev) => ({ ...prev, error: errorMessage }));
			toast.error(errorMessage);
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const clearError = () => {
		setState((prev) => ({ ...prev, error: null }));
	};

	return {
		form,
		isLoading: state.isLoading,
		error: state.error,
		handleSubmit,
		clearError,
	};
};
