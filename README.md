# 🧾 Accountant Hub

A job marketplace for accountants — browse jobs, submit bids, track applications.

---

## 🔑 Test Login Credentials
```
Email:    test@accountanthub.com
Password: Test12345
```

---

## ✅ Run Locally — 5 Steps (Windows / Mac / Linux)

### Step 1 — Install Node.js (one time only)
Download from **https://nodejs.org** → click "LTS" → install → restart PC

Verify it works:
```
node --version
```
Should print something like `v20.x.x`

---

### Step 2 — Open your project folder in terminal

**Windows:** Press `Win + R` → type `cmd` → Enter
**Mac/Linux:** Open Terminal

```
cd C:\path\to\accountant-hub
```

---

### Step 3 — Install all packages
```
npm install
```
Wait ~2 minutes. This downloads all dependencies.

---

### Step 4 — Set up the database
```
npx prisma db push
npm run db:seed
```
This creates the SQLite database and inserts 15 demo jobs + test account.

---

### Step 5 — Start the app
```
npm run dev
```

Open browser → **http://localhost:3000** ✅

---

## 📁 Project Structure
```
accountant-hub/
├── app/                    ← All pages and API routes
│   ├── (auth)/             ← Login and Register pages
│   ├── (dashboard)/        ← Jobs listing, Job detail, Dashboard
│   ├── (root)/             ← Homepage
│   └── api/                ← Backend API endpoints
├── components/             ← Reusable UI components
├── services/               ← Business logic layer
├── lib/                    ← Prisma client, Auth config, API helpers
├── validations/            ← Zod input validation schemas
├── types/                  ← TypeScript type definitions
├── utils/                  ← Helper functions (dates, currency, etc.)
└── prisma/
    ├── schema.prisma       ← Database models
    └── seed.ts             ← Demo data
```

---

## 🌐 API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/signin` | Login | No |
| GET | `/api/jobs` | List jobs (with filters) | No |
| GET | `/api/jobs?search=tax&category=bookkeeping&sort=budget_desc&page=1` | Filtered jobs | No |
| GET | `/api/jobs/:id` | Single job details | No |
| GET | `/api/jobs/categories` | All categories | No |
| POST | `/api/bids` | Submit a bid | ✅ Yes |
| GET | `/api/dashboard` | My bids + stats | ✅ Yes |

---

## 🚀 Deploy to Vercel (Free)

1. Create account at **https://vercel.com**
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel` in the project folder
4. Follow the prompts

**For production database** — replace SQLite with free PostgreSQL from https://neon.tech:
1. Create a free Neon database
2. Copy the connection string
3. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`
4. Set `DATABASE_URL` in Vercel environment variables

---

## 🔧 Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:seed` | Insert demo data |
| `npm run db:studio` | Visual database browser |
| `npm run db:reset` | Wipe and re-seed database |
| `npx prisma db push` | Sync schema to database |

---

## 🐛 Common Errors

**"Cannot find module @prisma/client"**
```
npx prisma generate
```

**"DATABASE_URL not found"**
- Make sure `.env` file exists in the root folder
- It should contain: `DATABASE_URL="file:./dev.db"`

**Port 3000 already in use**
```
npm run dev -- --port 3001
```

**Seed fails**
```
npm run db:reset
```
