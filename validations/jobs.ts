// validations/jobs.ts
import { z } from "zod";

export const jobsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(9),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  budgetMin: z.coerce.number().nonnegative().optional(),
  budgetMax: z.coerce.number().positive().optional(),
  sort: z
    .enum(["newest", "oldest", "budget_desc", "budget_asc"])
    .default("newest"),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export type JobsQuery = z.infer<typeof jobsQuerySchema>;
