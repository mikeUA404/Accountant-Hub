// app/api/auth/[...nextauth]/route.ts
// NextAuth catch-all route — handles all /api/auth/* requests automatically

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
