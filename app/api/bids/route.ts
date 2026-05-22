// app/api/bids/route.ts
// POST /api/bids — Submit a new bid (authenticated only)

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { bidSchema } from "@/validations/bids";
import { submitBid, BidServiceError } from "@/services/bid.service";
import {
  createdResponse,
  errorResponse,
  unauthorizedResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("You must be logged in to submit a bid");
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const parsed = bidSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "Validation failed",
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    // 3. Submit bid via service
    const bid = await submitBid(parsed.data, session.user.id);

    return createdResponse(bid, "Bid submitted successfully!");
  } catch (error) {
    if (error instanceof BidServiceError) {
      switch (error.code) {
        case "NOT_FOUND":
          return notFoundResponse(error.message);
        case "JOB_CLOSED":
          return errorResponse(error.message, 422);
        case "DUPLICATE_BID":
          return conflictResponse(error.message);
        case "INVALID_PRICE":
          return errorResponse(error.message, 422);
      }
    }

    console.error("[BID SUBMIT ERROR]", error);
    return serverErrorResponse("Failed to submit bid. Please try again.");
  }
}
