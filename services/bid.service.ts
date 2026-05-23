// services/bid.service.ts
import { prisma } from "@/lib/prisma";
import { BidFormInput } from "@/validations/bids";

export async function submitBid(input: BidFormInput, userId: string) {
  const { jobId, proposedPrice, deliveryTime, coverLetter, experience } = input;

  // Check job exists and is open
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true, budgetMin: true, budgetMax: true },
  });

  if (!job) throw new BidServiceError("Job not found", "NOT_FOUND");
  if (job.status === "CLOSED") throw new BidServiceError("This job is closed and no longer accepting bids", "JOB_CLOSED");

  // Check for duplicate bid
  const existingBid = await prisma.bid.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existingBid) throw new BidServiceError("You have already submitted a bid for this job", "DUPLICATE_BID");

  // Create the bid
  const bid = await prisma.bid.create({
    data: { proposedPrice, deliveryTime, coverLetter, experience, userId, jobId },
    include: {
      job: { select: { id: true, title: true, company: true } },
    },
  });

  return bid;
}

export async function getUserBids(userId: string) {
  return prisma.bid.findMany({
    where: { userId },
    include: {
      job: {
        select: {
          id: true, title: true, company: true, shortDescription: true,
          budgetMin: true, budgetMax: true, deadline: true,
          deliveryTime: true, status: true, postedAt: true,
          category: { select: { id: true, name: true, slug: true, color: true } },
          _count: { select: { bids: true } },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getUserDashboardStats(userId: string) {
  const [totalBids, pendingBids, acceptedBids, rejectedBids] = await Promise.all([
    prisma.bid.count({ where: { userId } }),
    prisma.bid.count({ where: { userId, status: "PENDING" } }),
    prisma.bid.count({ where: { userId, status: "ACCEPTED" } }),
    prisma.bid.count({ where: { userId, status: "REJECTED" } }),
  ]);
  return { totalBids, pendingBids, acceptedBids, rejectedBids };
}

export class BidServiceError extends Error {
  constructor(message: string, public code: "NOT_FOUND" | "JOB_CLOSED" | "DUPLICATE_BID" | "INVALID_PRICE") {
    super(message);
    this.name = "BidServiceError";
  }
}
