import type { UseFormReturn } from "react-hook-form";
import type { SignInInput } from "./validation";

export interface SignInFormData {
	email: string;
	password: string;
}

export interface SignInFormProps {
	form: UseFormReturn<SignInInput>;
	onSubmit: (data: SignInFormData) => Promise<void>;
	isLoading: boolean;
	error: string | null;
}

export interface SignInPageState {
	isLoading: boolean;
	error: string | null;
}
