export interface SignUpFormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface SignUpResponse {
	success: boolean;
	message?: string;
	user?: {
		id: string;
		name: string;
		email: string;
	};
}

export interface SignUpError {
	message: string;
	field?: keyof SignUpFormData;
}

export interface SignUpFormProps {
	onSubmit: (data: SignUpFormData) => Promise<void>;
	isLoading: boolean;
	error: string | null;
}

export interface SignUpPageState {
	isLoading: boolean;
	error: string | null;
}
