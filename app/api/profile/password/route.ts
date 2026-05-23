// app/api/profile/password/route.ts
// PATCH /api/profile/password — change password

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, and number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorizedResponse();

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return unauthorizedResponse();

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!isValid) {
      return errorResponse("Current password is incorrect", 400);
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return successResponse(null, "Password changed successfully");
  } catch (e) {
    console.error("[PASSWORD PATCH]", e);
    return serverErrorResponse();
  }
}
