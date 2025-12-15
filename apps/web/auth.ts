
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const config = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          // The API returns { accessToken: "...", user: { ... } }
          if (data && data.accessToken && data.user) {
             return { ...data.user, accessToken: data.accessToken };
          }
          return null;
        } catch (e) {
            console.error(e)
            return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        // Persist other user fields if needed
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        if (session.user) {
          session.user.name = token.name;
          if (token.email) {
            session.user.email = token.email;
          }
          // session.user.id = token.id as string; // if you extend session user type with id
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
