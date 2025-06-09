import { signIn } from "next-auth/react";
import type { SignInFormData } from "./types";

export const signInUser = async (data: SignInFormData) => {
	return await signIn("credentials", {
		email: data.email,
		password: data.password,
		redirect: false,
	});
};
