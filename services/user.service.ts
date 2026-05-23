// services/user.service.ts
// Business logic for user registration and profile

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth";

/**
 * Register a new accountant
 * Hashes password, checks for duplicate email
 */
export async function registerUser(input: RegisterInput) {
  const { name, email, password } = input;

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    throw new UserServiceError(
      "An account with this email already exists",
      "EMAIL_TAKEN"
    );
  }

  // Hash password with bcrypt (12 salt rounds = secure + not too slow)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

// ── Custom Error Class ────────────────────────────────────

export class UserServiceError extends Error {
  constructor(
    message: string,
    public code: "EMAIL_TAKEN" | "NOT_FOUND"
  ) {
    super(message);
    this.name = "UserServiceError";
  }
}
