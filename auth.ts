import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	trustHost: true,
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				// Validate input
				const loginSchema = z.object({
					email: z.string().email(),
					password: z.string().min(6),
				});

				const validatedFields = loginSchema.safeParse(credentials);
				if (!validatedFields.success) return null;

				const { email, password } = validatedFields.data;

				try {
					// Find user in database
					const user = await prisma.user.findUnique({
						where: { email },
					});

					if (!user || !user.password) return null;

					// Check password
					const passwordsMatch = await bcrypt.compare(password, user.password);
					if (!passwordsMatch) return null;

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role,
						image: user.image,
					};
				} catch (error) {
					console.error("Error during authentication:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user && "role" in user) {
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
				session.user.role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
});
