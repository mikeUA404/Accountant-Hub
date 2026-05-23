// components/shared/session-provider.tsx
// Client-side wrapper for NextAuth SessionProvider
// Required because SessionProvider uses React context (client-only)

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export function SessionProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
