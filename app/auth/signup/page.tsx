"use client";

import { SignUpCard, SignUpFooter, SignUpForm } from "./components";
import { useSignUp } from "./hooks";

export default function SignUpPage() {
	const { form, isLoading, error, handleSubmit } = useSignUp();

	return (
		<SignUpCard>
			<SignUpForm
				form={form}
				onSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
			/>
			<SignUpFooter />
		</SignUpCard>
	);
}
