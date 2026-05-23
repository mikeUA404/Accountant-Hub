// lib/auth.config.ts
// Edge-safe config — NO Prisma, NO bcrypt imports
// Used by middleware which runs in the Edge runtime

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // Credentials provider defined here without the authorize logic
    // The actual authorize runs in auth.ts (server-only)
    // We just need the provider listed here for the config to be valid
    Credentials({}),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    authorized({ auth }) {
      // Used by the middleware to check if user is authenticated
      return !!auth?.user;
    },
  },
};
