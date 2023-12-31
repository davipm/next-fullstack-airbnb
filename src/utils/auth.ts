import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { SessionInterface } from "@/types";
import prisma from "@/utils/connect";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user?.hashedPassword,
        );

        if (user && passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        const currentUser = await prisma.user.findUnique({
          where: {
            email: session?.user?.email as string,
          },
        });

        const favorites = await prisma.listing.findMany({
          where: {
            id: {
              in: [...(currentUser?.favoriteIds || [])],
            },
          },
        });

        if (!currentUser) return session;

        return {
          ...session,
          user: {
            ...session.user,
            ...currentUser,
            favorites: favorites.map((favorite) => ({
              ...favorite,
              createdAt: favorite.createdAt.toString(),
            })),
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
          },
        };
      } catch (error) {
        console.log("Error retrieving user data", error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser() {
  return (await getServerSession(authOptions)) as SessionInterface;
}
