// lib/api-response.ts
// Reusable API response helpers — keeps all responses consistent

import { NextResponse } from "next/server";
import { ApiResponse, PaginationMeta } from "@/types";

// ── Success Responses ─────────────────────────────────────

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
  pagination?: PaginationMeta
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(pagination && { pagination }),
    },
    { status }
  );
}

export function createdResponse<T>(
  data: T,
  message = "Created successfully"
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

// ── Error Responses ───────────────────────────────────────

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
}

export function unauthorizedResponse(
  message = "Unauthorized access"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(
  message = "Access forbidden"
): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(
  message = "Resource not found"
): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function conflictResponse(
  message = "Resource already exists"
): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

export function serverErrorResponse(
  message = "Internal server error"
): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}

// ── Pagination Helper ─────────────────────────────────────

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
