// lib/auth.ts
// Server-only — imports Prisma and bcrypt
// DO NOT import this in middleware

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/validations/auth";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const { email, password } = parsed.data;

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return { id: user.id, name: user.name, email: user.email };
        } catch (err) {
          console.error("[AUTH AUTHORIZE ERROR]", err);
          return null;
        }
      },
    }),
  ],
});
