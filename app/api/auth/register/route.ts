// app/api/auth/register/route.ts
// POST /api/auth/register — Create a new accountant account

import { NextRequest } from "next/server";
import { registerSchema } from "@/validations/auth";
import { registerUser, UserServiceError } from "@/services/user.service";
import {
  createdResponse,
  errorResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    // Delegate to service layer
    const user = await registerUser(parsed.data);

    return createdResponse(
      { id: user.id, name: user.name, email: user.email },
      "Account created successfully. Please log in."
    );
  } catch (error) {
    if (error instanceof UserServiceError) {
      if (error.code === "EMAIL_TAKEN") {
        return conflictResponse(error.message);
      }
    }

    console.error("[REGISTER ERROR]", error);
    return serverErrorResponse("Failed to create account. Please try again.");
  }
}
