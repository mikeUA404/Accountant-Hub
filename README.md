# 🧾 Accountant Hub

A full-stack web application that connects accountants with companies posting accounting jobs — similar to a specialized Upwork for the accounting industry.

**Test Credentials**
```
Email:    test@accountanthub.com
Password: Test12345
```

---

## 📋 Project Overview

Accountant Hub is a job marketplace where:
- **Companies** post accounting jobs (tax, audit, bookkeeping, payroll, financial advisory)
- **Accountants** browse jobs, view details, and submit competitive bids
- **The platform** prevents duplicate bids, enforces job status rules, and protects all sensitive routes

The app covers the full product lifecycle: authentication, job discovery with filters/pagination, bid submission with validation, a personal dashboard, and a profile management page.

---

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one repo — server components, API routes, middleware |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Tailwind CSS | Utility-first, no runtime overhead |
| Auth | NextAuth v5 (JWT) | Session management with hashed credentials |
| ORM | Prisma | Type-safe database queries, prevents SQL injection by design |
| Database | SQLite (local) / PostgreSQL (production) | Zero config locally, easy swap for production |
| Validation | Zod | Runtime schema validation on every API input |
| Forms | React Hook Form | Performant form state + client-side validation UX |
| Components | Custom (shadcn/ui style) | Reusable, accessible, no external component lock-in |

---

## 📁 Folder Structure

```
accountant-hub/
│
├── app/                          ← Next.js App Router
│   ├── (auth)/                   ← Auth pages (login, register) — no shared layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (dashboard)/              ← Main app pages
│   │   ├── jobs/
│   │   │   ├── page.tsx          ← Jobs listing with search, filters, pagination
│   │   │   └── [id]/page.tsx     ← Job detail + bid submission form
│   │   ├── dashboard/page.tsx    ← Accountant dashboard — bids + stats
│   │   └── profile/page.tsx      ← Edit profile, skills, change password
│   │
│   ├── (root)/
│   │   └── page.tsx              ← Public homepage / landing page
│   │
│   └── api/                      ← Backend API routes (REST)
│       ├── auth/
│       │   ├── [...nextauth]/route.ts   ← NextAuth handler (login/logout/session)
│       │   └── register/route.ts        ← POST — create new account
│       ├── jobs/
│       │   ├── route.ts                 ← GET — list jobs with filtering + pagination
│       │   ├── [id]/route.ts            ← GET — single job detail
│       │   └── categories/route.ts      ← GET — all job categories
│       ├── bids/route.ts                ← POST — submit a bid (auth required)
│       ├── dashboard/route.ts           ← GET — user's bids + stats (auth required)
│       └── profile/
│           ├── route.ts                 ← GET / PATCH — view and update profile
│           └── password/route.ts        ← PATCH — change password
│
├── components/
│   ├── ui/           ← Base components: Button, Input, Badge, Textarea, Toaster
│   ├── layout/       ← Navbar (with user dropdown), Sidebar
│   ├── jobs/         ← JobCard, JobsFilter
│   ├── bids/         ← BidForm
│   ├── dashboard/    ← StatsCards, BidsTable
│   └── shared/       ← Pagination, SessionProvider
│
├── services/                     ← Business logic — never in route handlers
│   ├── job.service.ts            ← Job queries, filtering, pagination
│   ├── bid.service.ts            ← Bid submission, duplicate prevention, stats
│   └── user.service.ts           ← Registration, password hashing
│
├── lib/
│   ├── prisma.ts                 ← Prisma client singleton
│   ├── auth.ts                   ← NextAuth configuration + JWT callbacks
│   └── api-response.ts           ← Reusable response helpers (success/error/pagination)
│
├── validations/                  ← Zod schemas — single source of truth for input rules
│   ├── auth.ts                   ← Register + Login schemas
│   ├── bids.ts                   ← Bid submission schema
│   └── jobs.ts                   ← Jobs query parameters schema
│
├── types/index.ts                ← All shared TypeScript interfaces
├── utils/index.ts                ← Date formatting, currency, class merging helpers
├── middleware.ts                  ← Route protection (JWT check, no Prisma in edge)
├── prisma/
│   ├── schema.prisma             ← Database models and relationships
│   └── seed.ts                   ← 15 demo jobs, 5 categories, 1 test user, 3 sample bids
└── .env.example                  ← Environment variables template
```

---

## 🚀 Setup Instructions — Run Locally

### Prerequisites (install once)

1. **Node.js v18+** → https://nodejs.org → click "LTS" → install
2. Verify: open a terminal and run `node --version` (should show v18 or higher)

### Step-by-Step

```bash
# 1. Extract the zip and enter the folder
cd accountant-hub

# 2. Install all packages
npm install

# 3. Set up the database (creates dev.db SQLite file)
npx prisma db push

# 4. Seed demo data (15 jobs + test user + 3 sample bids)
npm run db:seed

# 5. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Environment Variables

The `.env` file is included and pre-configured for local development:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="accountant-hub-secret-key-change-in-production-32chars"
NEXTAUTH_URL="http://localhost:3000"
```

For production, generate a real secret:
```bash
openssl rand -base64 32
```

### Useful Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run db:seed` | Insert all demo data |
| `npm run db:studio` | Open Prisma visual DB browser |
| `npm run db:reset` | Wipe database and re-seed |
| `npx prisma db push` | Apply schema changes to database |

---

## 🌐 API Endpoints

All endpoints return a consistent JSON response format:

```json
// Success
{ "success": true, "message": "Jobs retrieved successfully", "data": [...], "pagination": {} }

// Error
{ "success": false, "message": "Unauthorized access" }

// Validation error
{ "success": false, "message": "Validation failed", "errors": { "email": ["Invalid email"] } }
```

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create a new accountant account | No |
| POST | `/api/auth/signin` | Login with email and password | No |
| POST | `/api/auth/signout` | Log out and clear session | Yes |

### Jobs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/jobs` | List jobs with filters and pagination | No |
| GET | `/api/jobs/:id` | Get full details for a single job | No |
| GET | `/api/jobs/categories` | Get all job categories with job counts | No |

**Job Query Parameters:**

| Parameter | Type | Example | Description |
|---|---|---|---|
| `page` | number | `?page=2` | Page number (default: 1) |
| `limit` | number | `?limit=9` | Results per page (max: 50) |
| `search` | string | `?search=tax` | Search title, company, description |
| `category` | string | `?category=bookkeeping` | Filter by category slug |
| `budgetMin` | number | `?budgetMin=1000` | Minimum budget filter |
| `budgetMax` | number | `?budgetMax=5000` | Maximum budget filter |
| `sort` | string | `?sort=budget_desc` | newest / oldest / budget_desc / budget_asc |
| `status` | string | `?status=OPEN` | OPEN or CLOSED |

**Example:**
```
GET /api/jobs?page=1&category=tax-preparation&sort=budget_desc&budgetMin=1000
```

### Bids

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/bids` | Submit a bid for a job | ✅ Yes |

**Bid Request Body:**
```json
{
  "jobId": "clxxxxx",
  "proposedPrice": 2500,
  "deliveryTime": "3 weeks",
  "coverLetter": "I am the best fit because... (min 50 chars)",
  "experience": "8 years CPA experience... (min 20 chars)"
}
```

### Dashboard

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/dashboard` | Get current user's bids + statistics | ✅ Yes |

### Profile

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile` | Get current user's profile | ✅ Yes |
| PATCH | `/api/profile` | Update name, bio, skills | ✅ Yes |
| PATCH | `/api/profile/password` | Change password | ✅ Yes |

---

## 🔒 Security Implementation

This section explains exactly how each web vulnerability is handled in the codebase.

### 1. SQL Injection — Prevented by Prisma ORM

SQL injection is an attack where a malicious user inserts raw SQL into an input field to manipulate the database query. For example:

```
Email field input: ' OR '1'='1
```

If concatenated directly into a query, this could log in anyone.

**How we prevent it:**
Prisma ORM never concatenates user input into SQL strings. Every query uses parameterized prepared statements internally. Prisma generates safe SQL regardless of what the user types.

```typescript
// ✅ Safe — Prisma handles escaping automatically
const user = await prisma.user.findUnique({
  where: { email: email }, // email could be anything — Prisma makes it safe
});

// ❌ What we never do — raw string concatenation
// db.query("SELECT * FROM users WHERE email = '" + email + "'")
```

Even if a user types `' DROP TABLE users; --` into the email field, Prisma treats it as a literal string value, not SQL code. The database never sees it as executable SQL.

### 2. XSS (Cross-Site Scripting) — Prevented by React + Zod

XSS is an attack where malicious JavaScript is injected into content that gets rendered on the page, allowing attackers to steal session cookies or impersonate users.

**How we prevent it — two layers:**

**Layer 1 — React's automatic escaping:**
React escapes all values rendered in JSX by default. If a job title stored in the database contains `<script>alert('xss')</script>`, React renders it as literal text, not executable HTML. The script never runs.

```tsx
// ✅ Safe — React escapes this automatically
<h1>{job.title}</h1>
// Renders as text: <script>alert('xss')</script>
// NOT as executable: <script>alert('xss')</script>
```

We never use `dangerouslySetInnerHTML` anywhere in this project.

**Layer 2 — Zod input length limits:**
Zod schemas enforce strict maximum lengths on every user-supplied field, which limits the payload size an attacker could submit:

```typescript
name: z.string().min(2).max(100).trim(),        // Name capped at 100 chars
coverLetter: z.string().min(50).max(2000),       // Proposal capped at 2000 chars
experience: z.string().min(20).max(1000),        // Experience capped at 1000 chars
bio: z.string().max(500),                        // Bio capped at 500 chars
```

### 3. CSRF (Cross-Site Request Forgery) — Handled by NextAuth

CSRF attacks trick a logged-in user's browser into making requests to our server from a malicious third-party site.

**How we prevent it:**
NextAuth v5 automatically includes CSRF token protection for all authentication endpoints. The session token is stored as an HTTP-only cookie, which means JavaScript on other domains cannot read it.

Additionally, our API routes that mutate data (POST /api/bids, PATCH /api/profile) all check for a valid session using `auth()` before doing anything. Requests without a valid session are rejected with 401.

### 4. Authentication Protection — JWT + Middleware

Every protected route (dashboard, profile, bid submission) is guarded at two levels:

**Level 1 — Middleware (before the page loads):**
```typescript
// middleware.ts — runs on every request
const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
if (!token && path.startsWith("/dashboard")) {
  redirect to /login
}
```

**Level 2 — API route guard (before any data operation):**
```typescript
// Every protected API route
const session = await auth();
if (!session?.user?.id) {
  return unauthorizedResponse("You must be logged in");
}
```

This double check means even if middleware is bypassed, the API still rejects unauthenticated requests.

### 5. Duplicate Bid Prevention — Database + Application Layer

Duplicate bid prevention is enforced at two independent layers, so even if one fails, the other catches it:

**Layer 1 — Database constraint:**
The Prisma schema has a unique constraint on the combination of `userId` and `jobId`:

```prisma
@@unique([userId, jobId])
```

This means the database itself physically rejects a second bid from the same user for the same job, regardless of what the application code does.

**Layer 2 — Application check (before hitting the database):**
```typescript
const existingBid = await prisma.bid.findUnique({
  where: { userId_jobId: { userId, jobId } },
});
if (existingBid) {
  throw new BidServiceError("You have already submitted a bid", "DUPLICATE_BID");
}
```

This gives the user a clear error message rather than a raw database error.

### 6. Password Security — bcrypt Hashing

Passwords are never stored in plain text. We use bcrypt with 12 salt rounds:

```typescript
const hashedPassword = await bcrypt.hash(password, 12);
```

12 rounds means even if the database is compromised, passwords cannot be reversed in any practical timeframe. When a user logs in, we compare using `bcrypt.compare()` which also resists timing attacks.

### 7. Sensitive Data Never Exposed

The password hash is never included in any API response. All user queries use explicit `select` to whitelist safe fields:

```typescript
select: { id: true, name: true, email: true, bio: true, skills: true }
// password field is deliberately omitted every time
```

---

## ✅ Feature Checklist

### Required Features
- [x] Jobs listing page with cards showing title, company, budget, deadline, category, bid count, status
- [x] Search by job title
- [x] Filter by category
- [x] Filter by budget range (min/max)
- [x] Sort by newest / oldest / highest budget / lowest budget
- [x] Job details page with full description, skills, client info, delivery time, budget, bid count
- [x] Attachments placeholder section
- [x] Submit bid form with proposed price, delivery time, cover letter, experience summary
- [x] Success message after bid submission (toast notification)
- [x] Duplicate bid prevention (DB constraint + application check)
- [x] Register / Login / Logout
- [x] Only authenticated users can submit bids

### Bonus Features
- [x] Dashboard showing submitted bids with statuses
- [x] Statistics cards (total / pending / accepted / rejected)
- [x] Job status handling — Open / Closed with visual badges
- [x] Pagination for job listing
- [x] Better filtering and sorting (4 sort options, budget range, category, status)
- [x] Reusable UI components (Button, Input, Badge, Textarea, Select, Toaster)
- [x] Clean API response format with consistent structure
- [x] README with full setup instructions
- [x] Seeded demo data (15 jobs, 5 categories, 1 user, 3 sample bids)
- [x] Profile page — edit name, bio, skills, change password

---

## 🗄️ Database Design

```
User ──< Bid >── Job ──> Category
```

| Relationship | Implementation |
|---|---|
| Job belongs to Category | `Job.categoryId` foreign key → `Category.id` |
| Job has many Bids | `Bid.jobId` foreign key → `Job.id` |
| User has many Bids | `Bid.userId` foreign key → `User.id` |
| One bid per user per job | `@@unique([userId, jobId])` compound constraint |
| Cascade delete | If a user is deleted, their bids are deleted (`onDelete: Cascade`) |

---

## 📝 Assumptions Made

1. **Accountant-only registration** — Only accountants can create accounts. Job posting is done via database seeding (no company-side UI needed for this assessment).
2. **SQLite for local development** — Chosen for zero-config setup. The schema is designed to be compatible with PostgreSQL for production with a one-line change in `schema.prisma`.
3. **No file uploads** — The attachments section in job details is a UI placeholder. Implementing actual file storage (S3, Cloudinary) is outside the scope.
4. **Bid status is admin-managed** — Bid statuses (PENDING → ACCEPTED/REJECTED) are updated via Prisma Studio or database directly. No evaluator UI was requested.
5. **No email verification** — Registration is instant without email confirmation, appropriate for this assessment context.
6. **All prices in USD** — Currency is fixed to US Dollars for simplicity.
7. **Session duration** — JWT sessions expire after 30 days for a good user experience.

---

## 🐛 Common Issues

**"enum not supported" error during prisma db push**
The schema uses `String` types instead of enums (SQLite limitation). If you see this, make sure you are using the latest version of the schema from this package.

**"Cannot find module autoprefixer"**
```bash
npm install
```
This installs autoprefixer which is listed in devDependencies.

**Seed script fails on Windows**
We use `tsconfig.seed.json` to handle the Windows JSON argument issue. Run:
```bash
npm run db:seed
```
Not `npx ts-node prisma/seed.ts` directly.

**Port 3000 in use**
```bash
npm run dev -- --port 3001
```

**Database out of sync**
```bash
npm run db:reset
```

---

## 🚀 Deploy to Vercel — Step by Step (Free)

### What you need
- A free GitHub account → https://github.com
- A free Vercel account → https://vercel.com
- A free Neon database (PostgreSQL) → https://neon.tech

---

### Step 1 — Switch database from SQLite to PostgreSQL

SQLite is a local file — it does not work on Vercel servers.
You need to switch to PostgreSQL before deploying.

**Open `prisma/schema.prisma` and change ONE line:**

```prisma
// Change this:
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// To this:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### Step 2 — Create a free PostgreSQL database on Neon

1. Go to **https://neon.tech** and click "Sign Up" (free, no credit card)
2. Create a new project — name it `accountant-hub`
3. After creation, click **"Connection Details"**
4. Copy the connection string — it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this — you will need it in Step 5

---

### Step 3 — Push your code to GitHub

Open your terminal in the project folder:

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit - Accountant Hub"
```

Now go to **https://github.com/new** and:
1. Name the repo `accountant-hub`
2. Set it to **Public**
3. Click **"Create repository"**
4. Copy the commands GitHub shows and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/accountant-hub.git
git branch -M main
git push -u origin main
```

---

### Step 4 — Connect to Vercel

1. Go to **https://vercel.com** and click **"Sign Up"**
2. Choose **"Continue with GitHub"** — this links your GitHub account
3. Click **"Add New Project"**
4. Find `accountant-hub` in the list and click **"Import"**
5. Leave all build settings as default — Vercel detects Next.js automatically
6. Do NOT click Deploy yet — go to Step 5 first

---

### Step 5 — Set Environment Variables in Vercel

Before deploying, scroll down to **"Environment Variables"** and add these three:

| Name | Value |
|---|---|
| `DATABASE_URL` | Paste your Neon connection string from Step 2 |
| `NEXTAUTH_SECRET` | A random 32-character secret (see below) |
| `NEXTAUTH_URL` | Leave blank for now — add it after first deploy |

**Generate NEXTAUTH_SECRET:**
- On Windows: go to https://generate-secret.vercel.app/32 and copy the result
- On Mac/Linux: run `openssl rand -base64 32` in terminal

Now click **"Deploy"** and wait ~2 minutes.

---

### Step 6 — Add your live URL to environment variables

After deploy succeeds, Vercel gives you a URL like:
```
https://accountant-hub-abc123.vercel.app
```

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add or update:
   ```
   NEXTAUTH_URL = https://accountant-hub-abc123.vercel.app
   ```
3. Go to **Deployments** → click the three dots on latest deployment → **Redeploy**

---

### Step 7 — Set up the production database

Run these commands from your local terminal with the Neon DATABASE_URL:

**On Windows:**
```cmd
set DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
npx prisma db push
npm run db:seed
```

**On Mac/Linux:**
```bash
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npm run db:seed
```

This creates all tables in Neon and inserts the 15 demo jobs + test user.

---

### Step 8 — Done! Your app is live ✅

Visit your Vercel URL and test everything:
- Register a new account
- Browse jobs
- Submit bids
- Check dashboard

**Add your live URL to your project submission.**

---

## 🔁 Updating the live app after code changes

Whenever you make changes locally:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel automatically detects the push and redeploys in ~1 minute. No manual action needed.


---

## 🔐 Security — What Was Implemented and Why

This section documents every web vulnerability that was addressed in the codebase, with code examples showing exactly how each one is prevented.

---

### 1. SQL Injection — Prevented by Prisma ORM

**What it is:** An attacker inserts raw SQL commands into an input field to manipulate or destroy the database. For example, typing `' OR '1'='1` into an email field could bypass authentication if the query is built by string concatenation.

**How this project prevents it:** Prisma ORM compiles every query into a parameterized prepared statement before sending it to the database. User input is always treated as a data value, never as SQL code — regardless of what the user types.

```typescript
// SAFE — Prisma parameterizes automatically
const user = await prisma.user.findUnique({
  where: { email: userInput }  // even if userInput = "' DROP TABLE users;--"
});
// Prisma sends: SELECT * FROM users WHERE email = $1  with $1 = the raw string
// The database never interprets it as SQL
```

We never use `prisma.$queryRawUnsafe()` or string-concatenated queries anywhere in the project.

---

### 2. XSS (Cross-Site Scripting) — Prevented by React + Zod

**What it is:** An attacker stores malicious JavaScript (e.g. `<script>document.cookie</script>`) in a field that later gets rendered on another user's screen. The script executes and can steal session tokens or impersonate the user.

**How this project prevents it — two layers:**

**Layer 1 — React's automatic output escaping:**
Every value rendered inside JSX is escaped by React before it reaches the browser's HTML parser. A job title of `<script>alert('xss')</script>` renders as literal visible text, not an executable script.

```tsx
// SAFE — React escapes < > " ' & automatically
<h1>{job.title}</h1>
// Browser sees: &lt;script&gt;alert('xss')&lt;/script&gt;
// User sees: <script>alert('xss')</script>  — as text, not code
```

We never use `dangerouslySetInnerHTML` anywhere in the project. All dynamic content goes through normal JSX rendering.

**Layer 2 — Zod maximum length limits on every input:**
Every user-supplied field is capped at a maximum character count server-side. This limits the payload size an attacker can inject.

```typescript
name: z.string().max(100),
coverLetter: z.string().max(2000),
experience: z.string().max(1000),
bio: z.string().max(500),
```

---

### 3. CSRF (Cross-Site Request Forgery) — Handled by NextAuth + SameSite Cookies

**What it is:** A malicious website tricks a logged-in user's browser into making an authenticated request to your app (e.g. clicking a hidden button that submits a form to `/api/bids`).

**How this project prevents it:**

**SameSite cookie policy:** The session cookie is set with `SameSite: lax`. The browser only sends it with requests originating from the same site. A request initiated from a third-party domain does not include the cookie — so the server sees it as unauthenticated.

**Session check on every mutation:** Every API route that changes data checks for a valid server-side session before doing anything:

```typescript
const session = await auth();
if (!session?.user?.id) {
  return unauthorizedResponse("You must be logged in");
}
```

A forged cross-origin request cannot obtain a valid session token, so it is rejected at this check.

---

### 4. Unauthorized Access — Double-Layer Route Protection

**What it is:** A user accesses a page or API endpoint they should not have access to, either by navigating directly to a URL or calling an API endpoint without logging in.

**How this project prevents it — two independent layers:**

**Layer 1 — Middleware (before the page renders):**
The middleware runs on every request before any page code executes. It reads the JWT from the session cookie and redirects unauthenticated users to the login page.

```typescript
// middleware.ts — runs on Vercel's Edge network before the request reaches Next.js
const isLoggedIn = !!req.auth?.user;
if (!isLoggedIn && path.startsWith("/dashboard")) {
  redirect to /login
}
```

**Layer 2 — API route guard (before any data is touched):**
Every protected API endpoint independently verifies the session. Even if the middleware were bypassed, the API still rejects the request.

```typescript
// Every protected route handler
const session = await auth();
if (!session?.user?.id) return unauthorizedResponse();
```

---

### 5. Duplicate Bid Fraud — Two Independent Enforcement Layers

**What it is:** A user submits multiple bids on the same job to game the system or flood the bid list.

**How this project prevents it:**

**Layer 1 — Application check (fast, user-friendly):**
Before inserting a bid, the service queries for an existing bid from the same user on the same job. If one exists, it returns a clear error message.

```typescript
const existingBid = await prisma.bid.findUnique({
  where: { userId_jobId: { userId, jobId } }
});
if (existingBid) throw new BidServiceError("You have already submitted a bid", "DUPLICATE_BID");
```

**Layer 2 — Database constraint (absolute enforcement):**
The Prisma schema has a compound unique constraint at the database level:

```prisma
@@unique([userId, jobId])
```

Even if a race condition bypasses the application check (two simultaneous requests), the database physically rejects the second insert with a unique constraint violation. No duplicate can ever exist in the database.

---

### 6. Password Security — bcrypt Hashing

**What it is:** If passwords are stored in plain text and the database is compromised, every user account is immediately exposed.

**How this project prevents it:**
Passwords are hashed using bcrypt with 12 salt rounds before being stored. bcrypt is a one-way function — the original password cannot be recovered from the hash. Even with full database access, an attacker cannot log in as any user without brute-forcing each hash individually.

```typescript
// On registration — hash before storing
const hashedPassword = await bcrypt.hash(password, 12);
await prisma.user.create({ data: { password: hashedPassword } });

// On login — compare without ever reversing the hash
const isValid = await bcrypt.compare(inputPassword, user.password);
```

12 rounds means each bcrypt operation takes ~250ms on modern hardware — fast enough for users, too slow to brute-force at scale.

---

### 7. Sensitive Data Exposure — Explicit Field Selection

**What it is:** Accidentally returning the password hash or other internal fields in an API response.

**How this project prevents it:**
Every database query that returns user data uses an explicit `select` to whitelist only safe fields. The `password` field is never included.

```typescript
// Every user query — password deliberately omitted
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    name: true,
    email: true,
    bio: true,
    skills: true,
    // password: NOT here — never returned
  }
});
```

---

### 8. Open Redirect Prevention

**What it is:** An attacker crafts a login URL like `/login?callbackUrl=https://evil.com` to redirect users to a malicious site after login.

**How this project prevents it:**
The `callbackUrl` parameter is validated to only accept paths that start with `/` — so it can only redirect within the same application.

```typescript
const rawCallback = searchParams.get("callbackUrl") ?? "/dashboard";
// Only allow internal paths — reject any absolute URL
const callbackUrl = rawCallback.startsWith("/") ? rawCallback : "/dashboard";
```

An attacker supplying `callbackUrl=https://evil.com` would be redirected to `/dashboard` instead.

---

### 9. Prisma in Edge Runtime — Architectural Separation

**What it is (Next.js specific):** Vercel's Edge Runtime (where middleware runs) does not support Node.js APIs. Importing Prisma in middleware causes a runtime crash — and if it did work, it would expose the database connection to the edge network.

**How this project prevents it:**
Auth configuration is split into two files:

- `lib/auth.config.ts` — Edge-safe. Contains only JWT callbacks and session config. **No Prisma, no bcrypt.** Imported by middleware.
- `lib/auth.ts` — Server-only. Contains the full Credentials provider with Prisma database lookups. Imported only by API routes and server components.

```typescript
// middleware.ts — imports ONLY the edge-safe config
import { authConfig } from "@/lib/auth.config";  // ✅ no Prisma
const { auth } = NextAuth(authConfig);

// API routes — import the full auth with Prisma
import { auth } from "@/lib/auth";               // ✅ server-only
```

This is the official NextAuth v5 recommended pattern for Next.js + Vercel deployments.

