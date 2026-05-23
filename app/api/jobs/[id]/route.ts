// app/api/jobs/[id]/route.ts
// GET /api/jobs/:id — Get a single job with full details

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getJobById } from "@/services/job.service";
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/api-response";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get session to check if user has already bid (optional — not required to view)
    const session = await auth();
    const userId = session?.user?.id;

    const job = await getJobById(params.id, userId);

    if (!job) {
      return notFoundResponse("Job not found");
    }

    return successResponse(job, "Job retrieved successfully");
  } catch (error) {
    console.error("[JOB DETAIL ERROR]", error);
    return serverErrorResponse("Failed to retrieve job");
  }
}
