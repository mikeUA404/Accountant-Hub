// app/api/dashboard/route.ts
// GET /api/dashboard — Get current user's dashboard data (authenticated only)

import { auth } from "@/lib/auth";
import { getUserBids, getUserDashboardStats } from "@/services/bid.service";
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("You must be logged in to view your dashboard");
    }

    const userId = session.user.id;

    // Fetch stats and bids in parallel
    const [stats, recentBids] = await Promise.all([
      getUserDashboardStats(userId),
      getUserBids(userId),
    ]);

    return successResponse(
      { stats, recentBids },
      "Dashboard data retrieved successfully"
    );
  } catch (error) {
    console.error("[DASHBOARD ERROR]", error);
    return serverErrorResponse("Failed to load dashboard data");
  }
}
