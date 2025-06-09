import type { SignUpFormData, SignUpResponse } from "./types";

export const signUpUser = async (data: SignUpFormData): Promise<void> => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: data.name,
			email: data.email,
			password: data.password,
			confirmPassword: data.confirmPassword,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Something went wrong");
	}

	const result: SignUpResponse = await response.json();

	if (!result.success) {
		throw new Error(result.message || "Sign up failed");
	}
};
