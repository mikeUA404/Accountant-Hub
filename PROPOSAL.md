# Accountant Hub — Project Proposal

**Submitted by:** [Your Name]
**Role:** Full-Stack Developer
**Project:** Accountant Hub — Accounting Job Marketplace

---

## Executive Summary

Accountant Hub is a production-ready, full-stack web application that functions as a specialized job marketplace for the accounting industry. Companies post accounting jobs — tax preparation, auditing, bookkeeping, payroll, and financial advisory — while qualified accountants browse, filter, and submit competitive bids to win those engagements.

The platform was designed and built as a solo developer project, covering the complete product lifecycle: UI/UX design, frontend implementation, backend API architecture, database design, security hardening, and cloud deployment.

---

## Product Thinking

The core insight behind the product design is that accountants and their clients have very specific, domain-focused needs that a general platform like Upwork does not address well. Accountant Hub solves this by:

- **Category-specific filtering** — Jobs are organized by Tax, Audit, Bookkeeping, Payroll, and Financial Advisory so accountants instantly find relevant work
- **Budget-transparent listings** — Budget ranges are always visible on job cards, so accountants self-qualify before investing time in a proposal
- **Status clarity** — Open and Closed statuses are visually prominent so accountants never waste a bid on an expired listing
- **Bid tracking dashboard** — Accountants can track all their submitted proposals in one place with acceptance/rejection status, something freelancers always need

---

## Architecture & Code Quality

The project follows a strict **layered architecture** that separates concerns at every level:

```
Request → API Route (thin controller) → Service Layer (business logic) → Prisma (data layer)
```

**Route handlers are kept thin.** They do three things only: authenticate the request, validate the input, and call a service function. All business logic lives in service files (`job.service.ts`, `bid.service.ts`, `user.service.ts`).

**Consistent API response format** across all endpoints:

```json
{ "success": true,  "message": "Jobs retrieved", "data": [...], "pagination": {} }
{ "success": false, "message": "Unauthorized access" }
```

**TypeScript is used throughout** — every function, every component, every API response has explicit types. There are no `any` types in business logic.

**Reusable components** — Button, Input, Badge, Textarea, Select, Toaster, Pagination, JobCard, BidsTable, StatsCards — each built once and used everywhere. No duplicated UI logic.

---

## Backend Strengths

### ✅ Clean API Structure

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/jobs` | GET | List with filter, sort, paginate |
| `/api/jobs/:id` | GET | Full job details |
| `/api/jobs/categories` | GET | All categories |
| `/api/bids` | POST | Submit bid (auth required) |
| `/api/dashboard` | GET | User stats + bids (auth required) |
| `/api/profile` | GET / PATCH | View and edit profile |
| `/api/profile/password` | PATCH | Change password |
| `/api/auth/register` | POST | Create account |

### ✅ Proper Validation

Every API input is validated using Zod schemas before touching the database:

- Email format, password strength (uppercase + lowercase + number + min 8 chars)
- Bid fields: minimum cover letter length (50 chars), price range, required fields
- Query parameters: page numbers, budget ranges, valid sort options
- Profile updates: name length, bio character limit, skills format

Validation errors return structured field-level messages so the frontend can show inline errors.

### ✅ Authentication Protection

Two independent layers protect every sensitive route:

1. **Middleware** — runs before the page loads, redirects unauthenticated users to login
2. **API guard** — every protected endpoint calls `auth()` and rejects requests with no valid session

JWT tokens are stored as HTTP-only cookies — JavaScript on other domains cannot read them.

### ✅ Correct Database Relationships

```
Category ──< Job ──< Bid >── User
```

- A Job belongs to one Category (foreign key)
- A Job has many Bids
- A User has many Bids
- Cascade deletes — if a user is deleted, their bids are removed automatically

### ✅ Duplicate Bid Prevention — Two Layers

Layer 1 (application): checks for an existing bid before inserting and returns a clear error message.
Layer 2 (database): a `@@unique([userId, jobId])` constraint physically rejects duplicates at the database level even if the application check is bypassed.

### ✅ Proper Error Handling

Every API route is wrapped in try/catch. Errors are classified and return appropriate HTTP status codes:

| Situation | Status Code |
|---|---|
| Not logged in | 401 Unauthorized |
| Trying to bid on closed job | 422 Unprocessable Entity |
| Duplicate bid | 409 Conflict |
| Job not found | 404 Not Found |
| Validation failure | 422 with field errors |
| Unexpected server error | 500 (logged, not exposed) |

Internal error details are never sent to the client — only safe, user-friendly messages.

---

## Security Implementation

### SQL Injection — Eliminated by Design

**Prisma ORM uses parameterized queries exclusively.** User input is never concatenated into SQL strings. Even if a user types `' DROP TABLE users; --` into a search field, Prisma sends it to the database as a bound parameter value, not executable SQL.

```typescript
// This is always safe — Prisma handles escaping
prisma.user.findUnique({ where: { email: userInput } })
```

### XSS (Cross-Site Scripting) — Two Layers

**Layer 1 — React's automatic escaping:** React escapes all JSX values by default. A job title containing `<script>alert('xss')</script>` renders as literal text on screen. We never use `dangerouslySetInnerHTML` anywhere in the project.

**Layer 2 — Zod input length caps:** Every user-submitted text field has a maximum length enforced on the server. This limits the payload size an attacker could inject even before it reaches the database.

### CSRF — Handled by NextAuth

NextAuth v5 automatically provides CSRF protection for authentication endpoints. State-changing API routes also require a valid server-side session — a forged cross-origin request cannot obtain one.

### Password Security — bcrypt with 12 Rounds

Passwords are hashed using bcrypt before storage. 12 salt rounds means the hash is computationally expensive to brute-force. Passwords are never returned in any API response — all user queries use an explicit `select` that omits the password field.

### Sensitive Data Exposure — Prevented

```typescript
// Every user query explicitly selects safe fields only
select: { id: true, name: true, email: true, bio: true, skills: true }
// password is deliberately never selected
```

---

## Database Design

The schema is normalized, relationship-correct, and production-ready. It runs on SQLite locally and switches to PostgreSQL for production with a one-line change.

**Key design decisions:**
- CUID primary keys — collision-resistant, URL-safe, not guessable
- `@@unique([userId, jobId])` — database-level duplicate bid prevention
- `onDelete: Cascade` — referential integrity maintained automatically
- Status stored as String (not enum) for SQLite compatibility, validated at application layer
- Explicit `@@map()` — table names are clean snake_case regardless of model names

---

## UI/UX Design

The interface was built with a professional SaaS aesthetic using the specified brand colors (Black + #019a51 green).

**Design decisions:**
- **Dark theme** — reduces eye strain for professionals working long hours
- **Card-based job listing** — all key information visible without clicking through
- **Sticky navbar** — always accessible navigation
- **Dashboard sidebar** — clear navigation for authenticated users with clickable user card
- **Real-time form validation** — inline error messages appear as the user types, not just on submit
- **Password strength indicator** — visual feedback while creating a password
- **Skill tag pills** — professional-looking input for skills that can be added/removed individually
- **Toast notifications** — non-blocking success and error feedback
- **Loading skeletons** — placeholder UI while data loads, prevents layout shift
- **Empty states** — helpful messages when no jobs match filters or no bids exist yet
- **Responsive layout** — works on mobile, tablet, and desktop
- **Status badges** — green for Open, red for Closed, yellow for Pending — universally understood

---

## Bonus Features Delivered

| Feature | Status |
|---|---|
| Dashboard page with submitted bids | ✅ |
| Statistics cards (total / pending / accepted / rejected) | ✅ |
| Job status handling (Open / Closed) | ✅ |
| Pagination for job listing | ✅ |
| Advanced filtering and sorting (4 sort options) | ✅ |
| Reusable UI components | ✅ |
| Clean API response format | ✅ |
| README with full setup instructions | ✅ |
| Seeded demo data (15 jobs, 5 categories, 3 sample bids) | ✅ |
| Profile page (edit bio, skills, change password) | ✅ |
| User dropdown menu in navbar | ✅ |

---

## Deployment

The application is fully deployable on Vercel (frontend + API) with Neon PostgreSQL as the production database. Both are free tiers that support production workloads.

**Deployment stack:**
- **Vercel** — automatic CI/CD from GitHub. Every `git push` triggers a new deployment in ~1 minute
- **Neon** — serverless PostgreSQL. Free tier supports up to 3GB storage and automatic scaling
- **Environment variables** — all secrets managed through Vercel's dashboard, never committed to git

**Live URL:** [Add after deployment]

---

## Summary

Accountant Hub demonstrates the ability to independently design and ship a complete, production-quality web application. The project covers every layer of the stack — from database schema design to pixel-level UI decisions — with consistent attention to code quality, security, and user experience throughout.
