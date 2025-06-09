"use client";

import { Suspense } from "react";
import {
	SignInCard,
	SignInFooter,
	SignInForm,
	SignInLoadingFallback,
} from "./components";
import { useSignIn } from "./hooks";

function SignInFormContainer() {
	const { form, isLoading, error, handleSubmit } = useSignIn();
	return (
		<SignInCard>
			<SignInForm
				form={form}
				onSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
			/>
			<SignInFooter />
		</SignInCard>
	);
}

export default function SignInPage() {
	return (
		<Suspense fallback={<SignInLoadingFallback />}>
			<SignInFormContainer />
		</Suspense>
	);
}
