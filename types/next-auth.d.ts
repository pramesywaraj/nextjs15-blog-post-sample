import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: Role;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		role: Role;
		email: string;
		name?: string | null;
		image?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: Role;
	}
}
