// app/api/jobs/categories/route.ts
// GET /api/jobs/categories — Get all job categories

import { getCategories } from "@/services/job.service";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await getCategories();
    return successResponse(categories, "Categories retrieved successfully");
  } catch (error) {
    console.error("[CATEGORIES ERROR]", error);
    return serverErrorResponse("Failed to retrieve categories");
  }
}
