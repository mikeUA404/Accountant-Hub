// app/api/jobs/route.ts
// GET /api/jobs — Get paginated, filtered job listings
// Supports: ?page=1&limit=9&search=tax&category=bookkeeping&sort=budget_desc&budgetMin=500&budgetMax=5000

import { NextRequest } from "next/server";
import { jobsQuerySchema } from "@/validations/jobs";
import { getJobs } from "@/services/job.service";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const rawParams = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "9",
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      budgetMin: searchParams.get("budgetMin") ?? undefined,
      budgetMax: searchParams.get("budgetMax") ?? undefined,
      sort: searchParams.get("sort") ?? "newest",
      status: searchParams.get("status") ?? undefined,
    };

    const parsed = jobsQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return errorResponse("Invalid query parameters", 422);
    }

    const { jobs, pagination } = await getJobs(parsed.data);

    return successResponse(jobs, "Jobs retrieved successfully", 200, pagination);
  } catch (error) {
    console.error("[JOBS LIST ERROR]", error);
    return serverErrorResponse("Failed to retrieve jobs");
  }
}
