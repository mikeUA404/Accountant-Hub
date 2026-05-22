// services/job.service.ts
// Business logic for jobs — called by API route handlers

import { prisma } from "@/lib/prisma";
import { JobsQuery } from "@/validations/jobs";
import { buildPaginationMeta } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

const jobCardSelect = {
  id: true,
  title: true,
  company: true,
  companyLogo: true,
  shortDescription: true,
  budgetMin: true,
  budgetMax: true,
  deadline: true,
  deliveryTime: true,
  status: true,
  postedAt: true,
  category: {
    select: { id: true, name: true, slug: true, color: true },
  },
  _count: {
    select: { bids: true },
  },
} satisfies Prisma.JobSelect;

/**
 * Get paginated and filtered list of jobs
 */
export async function getJobs(query: JobsQuery) {
  const { page, limit, search, category, budgetMin, budgetMax, sort, status } = query;
  const skip = (page - 1) * limit;

  // Build where clause — SQLite uses 'contains' without mode:"insensitive"
  const where: Prisma.JobWhereInput = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { company: { contains: search } },
        { shortDescription: { contains: search } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...((budgetMin !== undefined || budgetMax !== undefined) && {
      AND: [
        ...(budgetMin !== undefined ? [{ budgetMax: { gte: budgetMin } }] : []),
        ...(budgetMax !== undefined ? [{ budgetMin: { lte: budgetMax } }] : []),
      ],
    }),
  };

  const orderBy: Prisma.JobOrderByWithRelationInput = (() => {
    switch (sort) {
      case "oldest":   return { postedAt: "asc" };
      case "budget_desc": return { budgetMax: "desc" };
      case "budget_asc":  return { budgetMin: "asc" };
      default:         return { postedAt: "desc" };
    }
  })();

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({ where, select: jobCardSelect, orderBy, skip, take: limit }),
  ]);

  return { jobs, pagination: buildPaginationMeta(page, limit, total) };
}

/**
 * Get a single job with full details
 */
export async function getJobById(id: string, userId?: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      category: true,
      _count: { select: { bids: true } },
      ...(userId ? {
        bids: {
          where: { userId },
          select: { id: true, proposedPrice: true, status: true, submittedAt: true },
          take: 1,
        },
      } : {}),
    },
  });

  if (!job) return null;

  const userBid = userId && "bids" in job && Array.isArray((job as any).bids)
    ? (job as any).bids[0] ?? null
    : null;

  return { ...job, userBid };
}

/**
 * Get all categories with job counts
 */
export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });
}
