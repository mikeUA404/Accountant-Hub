// app/api/profile/route.ts
// GET /api/profile  — get current user profile
// PATCH /api/profile — update name, bio, skills

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  bio: z.string().max(500, "Bio too long (max 500 characters)").optional().or(z.literal("")),
  skills: z.string().max(300, "Skills too long").optional().or(z.literal("")),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, bio: true, skills: true, createdAt: true },
    });

    if (!user) return unauthorizedResponse("User not found");
    return successResponse(user, "Profile retrieved");
  } catch (e) {
    console.error("[PROFILE GET]", e);
    return serverErrorResponse();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorizedResponse();

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio ?? "",
        skills: parsed.data.skills ?? "",
      },
      select: { id: true, name: true, email: true, bio: true, skills: true },
    });

    return successResponse(updated, "Profile updated successfully");
  } catch (e) {
    console.error("[PROFILE PATCH]", e);
    return serverErrorResponse();
  }
}
