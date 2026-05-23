# 🧾 Accountant Hub

A specialized job marketplace for accountants — similar to Upwork but focused exclusively on accounting jobs. Companies post jobs, accountants browse and submit bids.

**Live Demo:** _[Add your Vercel URL here after deployment]_

---

## 🔑 Test Credentials

```
Email:    test@accountanthub.com
Password: Test12345
```

---

## ✨ Features

- 📋 **Jobs Listing** — Browse 15+ seeded accounting jobs with search, filters, and pagination
- 🔍 **Job Details** — Full description, company info, required skills, deadline, and bid count
- 💼 **Bid Submission** — Submit proposals with price, delivery time, cover letter, and experience
- 🔐 **Authentication** — Register, login, and logout with hashed passwords
- 📊 **Dashboard** — Track all submitted bids with status and statistics
- 🚫 **Duplicate Prevention** — One bid per accountant per job (enforced in DB + API)
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark Theme** — Professional dark UI with green (#019a51) brand color

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom design system |
| Auth | NextAuth v5 (Auth.js) + Credentials Provider |
| Database | Prisma ORM + SQLite (local) |
| Validation | Zod + React Hook Form |
| Components | Custom UI components (shadcn/ui style) |
| Deployment | Vercel |

---

## 📁 Folder Structure

```
accountant-hub/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth pages group (no shared layout)
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Register page
│   ├── (dashboard)/            # Main app pages
│   │   ├── jobs/
│   │   │   ├── page.tsx        # Jobs listing with filters
│   │   │   └── [id]/page.tsx   # Job detail + bid form
│   │   └── dashboard/page.tsx  # Accountant dashboard
│   ├── (root)/
│   │   └── page.tsx            # Homepage / landing page
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── register/route.ts       # POST /api/auth/register
│   │   ├── jobs/
│   │   │   ├── route.ts        # GET /api/jobs (list + filter)
│   │   │   ├── [id]/route.ts   # GET /api/jobs/:id
│   │   │   └── categories/route.ts  # GET /api/jobs/categories
│   │   ├── bids/route.ts       # POST /api/bids
│   │   └── dashboard/route.ts  # GET /api/dashboard
│   ├── globals.css             # Global styles + CSS variables
│   ├── layout.tsx              # Root layout (fonts, providers)
│   └── not-found.tsx           # 404 page
│
├── components/                 # Reusable UI components
│   ├── ui/                     # Base UI (Button, Input, Badge, Toast)
│   ├── layout/                 # Navbar, Sidebar
│   ├── jobs/                   # JobCard, JobsFilter
│   ├── bids/                   # BidForm
│   ├── dashboard/              # StatsCards, BidsTable
│   └── shared/                 # Pagination, SessionProvider
│
├── services/                   # Business logic layer
│   ├── job.service.ts          # Job queries and filtering
│   ├── bid.service.ts          # Bid submission and validation
│   └── user.service.ts         # User registration
│
├── lib/                        # Shared utilities
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth configuration
│   └── api-response.ts         # Reusable API response helpers
│
├── validations/                # Zod schemas
│   ├── auth.ts                 # Register + Login schemas
│   └── bids.ts                 # Bid form + Jobs query schemas
│
├── types/                      # TypeScript type definitions
│   └── index.ts                # All shared types
│
├── utils/                      # Helper functions
│   └── index.ts                # Date, currency, class formatting
│
├── prisma/
│   ├── schema.prisma           # Database models + relationships
│   └── seed.ts                 # Seed script (15 jobs, 5 categories, 1 user)
│
├── middleware.ts               # Route protection (NextAuth)
├── .env.example                # Environment variables template
├── tailwind.config.ts          # Tailwind + brand colors
└── next.config.mjs             # Next.js configuration
```

---

## 🚀 Installation — Step by Step

### Step 1: Check Prerequisites

You need these installed on your PC:

**Node.js (v18 or higher)**
- Download from: https://nodejs.org
- Choose "LTS" version
- After installing, verify: open terminal and run `node --version`

**Git**
- Download from: https://git-scm.com
- After installing, verify: `git --version`

**VS Code (recommended editor)**
- Download from: https://code.visualstudio.com

---

### Step 2: Clone the Repository

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
# Clone the repo (replace with your actual repo URL)
git clone https://github.com/YOUR_USERNAME/accountant-hub.git

# Enter the project folder
cd accountant-hub
```

---

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take 1–2 minutes.

---

### Step 4: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Now open `.env` in VS Code. It should look like this:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="accountant-hub-secret-key-change-in-production-32chars"
NEXTAUTH_URL="http://localhost:3000"
```

✅ These defaults work for local development — no changes needed.

> **Note:** For production, generate a real secret with:
> ```bash
> openssl rand -base64 32
> ```

---

### Step 5: Set Up the Database

```bash
# Create the SQLite database and all tables
npx prisma db push
```

You should see: `✓ Your database is now in sync with your Prisma schema.`

---

### Step 6: Seed Demo Data

```bash
# Insert 15 accounting jobs, 5 categories, and 1 test user
npm run db:seed
```

You should see:
```
🌱 Starting database seed...
🗑️  Cleared existing data
✅ Created 5 categories
✅ Created test user: test@accountanthub.com
✅ Created 15 jobs
🎉 Seed completed successfully!

─────────────────────────────────────────
TEST CREDENTIALS:
  Email:    test@accountanthub.com
  Password: Test12345
─────────────────────────────────────────
```

---

### Step 7: Start the Development Server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

🎉 The app is running!

---

## 🔧 Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:reset` | Reset DB and re-seed |
| `npx prisma db push` | Sync schema to database |

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new accountant | No |
| POST | `/api/auth/signin` | Login (NextAuth) | No |
| POST | `/api/auth/signout` | Logout | Yes |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | List jobs with filters | No |
| GET | `/api/jobs?page=1&category=bookkeeping&sort=budget_desc` | Filtered + paginated | No |
| GET | `/api/jobs/:id` | Get single job details | No |
| GET | `/api/jobs/categories` | List all categories | No |

**Jobs Query Parameters:**
- `page` — Page number (default: 1)
- `limit` — Jobs per page (default: 9, max: 50)
- `search` — Search in title, company, description
- `category` — Filter by category slug (e.g. `bookkeeping`)
- `budgetMin` — Minimum budget filter
- `budgetMax` — Maximum budget filter
- `sort` — `newest` | `oldest` | `budget_desc` | `budget_asc`
- `status` — `OPEN` | `CLOSED`

**Example Response:**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 15,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Bids

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bids` | Submit a new bid | ✅ Yes |

**Bid Request Body:**
```json
{
  "jobId": "clxxxxx",
  "proposedPrice": 2500,
  "deliveryTime": "2 weeks",
  "coverLetter": "I am the perfect candidate because...",
  "experience": "8 years CPA experience with..."
}
```

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard` | Get user's bids + stats | ✅ Yes |

---

## 🚀 Deploy to Vercel (Step by Step)

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Accountant Hub"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/accountant-hub.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to **https://vercel.com** and sign up (free)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `accountant-hub` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables

In the Vercel setup screen, under **"Environment Variables"**, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `file:./dev.db` _(see note below)_ |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` and paste the result |
| `NEXTAUTH_URL` | `https://YOUR-APP-NAME.vercel.app` _(add after first deploy)_ |

> **⚠️ SQLite Note:** SQLite is a local file database — it doesn't work on Vercel's serverless infrastructure. For production, use **PlanetScale** (free MySQL) or **Neon** (free PostgreSQL):
>
> **Using Neon (PostgreSQL, recommended):**
> 1. Go to https://neon.tech and create a free account
> 2. Create a new project → copy the connection string
> 3. Set `DATABASE_URL` to that connection string in Vercel
> 4. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
> 5. Run `npx prisma migrate deploy` after connecting

### Step 4: Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies (`npm install`)
2. Generate Prisma client (`prisma generate`)
3. Build Next.js (`npm run build`)
4. Deploy globally ✅

### Step 5: Run Database Migrations on Production

After deploy, go to your Vercel project → **Settings** → **Functions** → open the terminal:

```bash
npx prisma db push
npm run db:seed
```

Or run locally targeting the production DB:
```bash
DATABASE_URL="your-production-db-url" npx prisma db push
DATABASE_URL="your-production-db-url" npm run db:seed
```

---

## 🐛 Common Issues & Fixes

**"Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**"Environment variable not found: DATABASE_URL"**
- Make sure `.env` file exists (copy from `.env.example`)
- Check the file is in the root folder, not inside `app/`

**"PrismaClientInitializationError"**
```bash
npx prisma db push
```

**Port 3000 already in use**
```bash
npm run dev -- --port 3001
```

**Seed fails with "unique constraint"**
```bash
npm run db:reset   # Clears everything and re-seeds
```

---

## 🎯 Assumptions Made

1. **Accountant-only platform** — Only accountants register. Job posting is admin/seeded only (no UI for companies to post jobs).
2. **SQLite for development** — Easy zero-config setup. Swap to PostgreSQL for production.
3. **No file uploads** — Attachments section is a placeholder UI (no actual file storage implemented).
4. **Bid status is manual** — Bid statuses (PENDING → ACCEPTED/REJECTED) are set in database directly. No admin UI for this yet.
5. **No email verification** — Registration is instant without email confirmation.
6. **Currency is USD** — All budgets and bid prices are in US Dollars.

---

## 📬 Contact

Built as a full-stack assessment project demonstrating:
- Layered architecture (routes → controllers → services → database)
- Type-safe TypeScript throughout
- Professional UI/UX with responsive design
- Secure authentication with hashed passwords
- Input validation on both client and server
