import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper: date N days from today
function future(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("🌱 Starting database seed...");

  await prisma.bid.deleteMany();
  await prisma.job.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  // ── Categories ──────────────────────────────────────────
  const [taxCat, auditCat, bookkeepCat, payrollCat, advisoryCat] = await Promise.all([
    prisma.category.create({ data: { name: "Tax Preparation",    slug: "tax-preparation",    color: "#019a51" } }),
    prisma.category.create({ data: { name: "Audit & Assurance",  slug: "audit-assurance",    color: "#0d6efd" } }),
    prisma.category.create({ data: { name: "Bookkeeping",        slug: "bookkeeping",         color: "#6f42c1" } }),
    prisma.category.create({ data: { name: "Payroll",            slug: "payroll",             color: "#fd7e14" } }),
    prisma.category.create({ data: { name: "Financial Advisory", slug: "financial-advisory",  color: "#dc3545" } }),
  ]);
  console.log("✅ Created 5 categories");

  // ── Test User ────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Test12345", 12);
  const testUser = await prisma.user.create({
    data: {
      name: "Ahmed Accountant",
      email: "test@accountanthub.com",
      password: hashedPassword,
      bio: "Senior accountant with 8+ years of experience in tax preparation and financial reporting.",
      skills: "QuickBooks,SAP,Tax Filing,GAAP,Excel,Financial Analysis",
    },
  });
  console.log("✅ Created test user: test@accountanthub.com");

  // ── 15 Jobs — all deadlines in the future ────────────────
  const jobsData = [
    {
      title: "Annual Corporate Tax Return Preparation",
      company: "TechFlow Solutions LLC",
      description: "We are seeking a qualified CPA to prepare our annual corporate tax return (Form 1120). Our company had revenues of approximately $2.5M in the last fiscal year with operations in 3 states.\n\nResponsibilities:\n- Review all financial statements and supporting documents\n- Prepare federal and state corporate tax returns\n- Identify potential deductions and tax-saving opportunities\n- Ensure compliance with current tax laws and regulations\n- Provide a summary of findings and recommendations",
      shortDescription: "Prepare annual corporate tax return for a $2.5M revenue tech company operating in 3 states.",
      skills: "CPA,Corporate Tax,Form 1120,State Tax,Tax Planning",
      budgetMin: 1500, budgetMax: 3000,
      deadline: future(45), deliveryTime: "3 weeks", status: "OPEN", categoryId: taxCat.id,
    },
    {
      title: "Monthly Bookkeeping & Bank Reconciliation",
      company: "Bella Boutique & Co.",
      description: "Small retail boutique looking for a reliable bookkeeper for ongoing monthly services.\n\nScope of work:\n- Record all daily transactions in QuickBooks Online\n- Reconcile 2 bank accounts and 1 credit card monthly\n- Generate monthly P&L and balance sheet\n- Categorize expenses properly\n- Provide monthly financial summary report\n\nWe have approximately 150-200 transactions per month.",
      shortDescription: "Ongoing monthly bookkeeping for a retail boutique — ~200 transactions/month using QuickBooks Online.",
      skills: "QuickBooks,Bookkeeping,Bank Reconciliation,P&L,Excel",
      budgetMin: 300, budgetMax: 600,
      deadline: future(20), deliveryTime: "Monthly recurring", status: "OPEN", categoryId: bookkeepCat.id,
    },
    {
      title: "Payroll Setup & Processing for 25 Employees",
      company: "GreenBuild Contractors",
      description: "Construction company expanding its team needs full payroll setup and ongoing processing.\n\nWhat we need:\n- Set up payroll system (ADP or Gusto)\n- Configure state and federal tax withholdings\n- Process bi-weekly payroll for 25 employees (mix of W2 and 1099)\n- Handle new hire onboarding documentation\n- File quarterly payroll tax reports\n- Year-end W2 and 1099 preparation",
      shortDescription: "Set up and manage bi-weekly payroll for 25 employees in a growing construction firm.",
      skills: "ADP,Gusto,Payroll,W2,1099,Tax Withholding,Prevailing Wage",
      budgetMin: 800, budgetMax: 1500,
      deadline: future(30), deliveryTime: "2 weeks setup + ongoing", status: "OPEN", categoryId: payrollCat.id,
    },
    {
      title: "Financial Audit for Non-Profit Organization",
      company: "Hope Community Foundation",
      description: "501(c)(3) non-profit foundation requires an independent financial audit for our fiscal year.\n\nAudit scope:\n- Review of all financial statements\n- Verification of grant compliance\n- Internal controls assessment\n- Donor restricted funds analysis\n- Preparation of audited financial statements\n- Management letter with recommendations\n\nWe have total annual revenues of $850K.",
      shortDescription: "Independent financial audit required for a non-profit with $850K annual revenue for grant compliance.",
      skills: "CPA,Non-Profit Audit,GAAP,Grant Compliance,Financial Statements",
      budgetMin: 4000, budgetMax: 7000,
      deadline: future(60), deliveryTime: "6-8 weeks", status: "OPEN", categoryId: auditCat.id,
    },
    {
      title: "QuickBooks Cleanup & Catch-Up Bookkeeping",
      company: "Sunrise Dental Practice",
      description: "Dental practice needs help cleaning up 18 months of messy QuickBooks data and getting current.\n\nScope:\n1. Review and audit all transactions from Jan 2023 to present\n2. Correct misclassified accounts\n3. Remove duplicate entries\n4. Reconcile all bank and credit card accounts\n5. Catch up on missing months\n6. Set up a clean chart of accounts going forward\n\nApproximately 300-400 transactions per month.",
      shortDescription: "Fix 18 months of messy QuickBooks data for a dental practice — cleanup, catch-up, and reconciliation.",
      skills: "QuickBooks,Bookkeeping,Cleanup,Bank Reconciliation,Chart of Accounts",
      budgetMin: 1200, budgetMax: 2500,
      deadline: future(35), deliveryTime: "4 weeks", status: "OPEN", categoryId: bookkeepCat.id,
    },
    {
      title: "Business Valuation for Acquisition",
      company: "Meridian Capital Partners",
      description: "Private equity firm seeking experienced accountant/valuator to perform a business valuation for a potential acquisition target in the food & beverage industry.\n\nDeliverables:\n- Income approach (DCF analysis)\n- Market approach (comparable company analysis)\n- Asset-based approach\n- Final valuation report with supporting documentation\n- Executive summary for investment committee\n\nTarget company has $8M annual revenue.",
      shortDescription: "Full business valuation for an $8M revenue food & beverage acquisition using multiple valuation approaches.",
      skills: "Business Valuation,DCF,Financial Modeling,M&A,CPA,CFA",
      budgetMin: 5000, budgetMax: 12000,
      deadline: future(25), deliveryTime: "2-3 weeks", status: "OPEN", categoryId: advisoryCat.id,
    },
    {
      title: "Sales Tax Compliance & Filing — E-Commerce",
      company: "ShopNova E-Commerce",
      description: "Fast-growing e-commerce store selling in 28 states needs help with sales tax compliance.\n\nScope:\n- Nexus analysis for all 50 states\n- Voluntary disclosure program applications where applicable\n- Back-filing for all states with nexus (estimated 3 years)\n- Set up TaxJar or Avalara integration\n- Ongoing quarterly filing going forward\n\nWe use Shopify and have approximately $4M in annual online sales.",
      shortDescription: "Urgent sales tax compliance for e-commerce company with nexus in 28 states — back-filing required.",
      skills: "Sales Tax,Nexus,TaxJar,Avalara,E-Commerce,Shopify,Multi-State Tax",
      budgetMin: 3000, budgetMax: 6000,
      deadline: future(50), deliveryTime: "6-10 weeks", status: "OPEN", categoryId: taxCat.id,
    },
    {
      title: "CFO Advisory Services — Series A Startup",
      company: "NeuralPath AI Inc.",
      description: "AI startup preparing for Series A fundraising needs fractional CFO services.\n\nWhat we need:\n- Financial model build-out (3-year projections)\n- Investor-ready financial package\n- KPI dashboard setup\n- Revenue recognition policy (SaaS)\n- Fundraising data room preparation\n- Due diligence support\n- Ongoing monthly advisory calls\n\nWe are a 12-person SaaS company with $180K ARR growing 20% MoM.",
      shortDescription: "Fractional CFO for AI startup preparing for Series A — financial modeling, investor materials, and advisory.",
      skills: "CFO,Financial Modeling,SaaS,Fundraising,KPIs,Revenue Recognition,Startups",
      budgetMin: 3500, budgetMax: 8000,
      deadline: future(90), deliveryTime: "Ongoing - 3 months", status: "OPEN", categoryId: advisoryCat.id,
    },
    {
      title: "Personal Tax Return — High Net Worth Individual",
      company: "Private Client (Confidential)",
      description: "High net worth individual with complex tax situation seeking experienced CPA for personal tax return preparation.\n\nComplexities include:\n- Multiple K-1s from partnerships and S-corps\n- Foreign bank accounts (FBAR filing required)\n- Real estate rental income (8 properties)\n- Stock options and RSU vesting\n- Charitable contribution strategies\n- AMT planning",
      shortDescription: "Complex personal tax return for HNW individual — K-1s, FBAR, rental income, stock options.",
      skills: "CPA,High Net Worth,K-1,FBAR,Rental Income,RSU,AMT Planning",
      budgetMin: 2500, budgetMax: 5000,
      deadline: future(40), deliveryTime: "4 weeks", status: "OPEN", categoryId: taxCat.id,
    },
    {
      title: "Internal Controls Review & SOX Compliance",
      company: "Vertex Manufacturing Corp.",
      description: "Public company subsidiary preparing for SOX compliance audit. Need an experienced accountant to review and document internal controls.\n\nScope:\n- Document current financial processes and controls\n- Identify control gaps and weaknesses\n- Risk assessment for financial reporting\n- Develop remediation plan\n- Prepare control matrix documentation\n- Support for external auditor testing\n\nThis is a critical project with a hard deadline.",
      shortDescription: "SOX internal controls review for a manufacturing subsidiary preparing for compliance audit.",
      skills: "SOX,Internal Controls,Risk Assessment,Audit,COSO Framework,CPA",
      budgetMin: 6000, budgetMax: 15000,
      deadline: future(55), deliveryTime: "6 weeks", status: "OPEN", categoryId: auditCat.id,
    },
    {
      title: "Restaurant Chain Bookkeeping — 3 Locations",
      company: "Pasta Pronto Group",
      description: "Family-owned restaurant group with 3 locations needs consolidated bookkeeping services.\n\nMonthly tasks:\n- Record daily sales from POS system\n- Food and beverage cost tracking\n- Labor cost analysis\n- Vendor invoice processing and AP management\n- Bank reconciliation for 5 accounts\n- Monthly P&L by location and consolidated\n- Food cost percentage reporting",
      shortDescription: "Monthly bookkeeping for a 3-location restaurant group — POS integration and multi-entity P&L.",
      skills: "Restaurant Accounting,QuickBooks,Toast POS,Food Cost,AP Management",
      budgetMin: 600, budgetMax: 1200,
      deadline: future(15), deliveryTime: "Monthly recurring", status: "OPEN", categoryId: bookkeepCat.id,
    },
    {
      title: "R&D Tax Credit Study",
      company: "BioSynth Laboratories",
      description: "Biotech company seeking specialist to identify and document qualifying R&D expenses for tax credit claim.\n\nProject includes:\n- Interview department heads to identify qualifying activities\n- Identify qualifying wages, supplies, and contractor costs\n- Prepare technical documentation (4-part test)\n- Calculate federal and state R&D credits\n- Prepare credit documentation package\n- Defend methodology if audited\n\nWe estimate $3-4M in potentially qualifying R&D expenses.",
      shortDescription: "R&D tax credit study for biotech company with $3-4M in qualifying expenses.",
      skills: "R&D Tax Credit,Section 41,Biotech,Tax Planning,CPA,Documentation",
      budgetMin: 8000, budgetMax: 18000,
      deadline: future(75), deliveryTime: "8-12 weeks", status: "OPEN", categoryId: taxCat.id,
    },
    {
      // One CLOSED job for visual variety
      title: "Estate Tax Return Preparation",
      company: "Morrison Family Estate",
      description: "Estate of recently deceased individual with taxable estate requiring Form 706 filing.\n\nEstate includes:\n- Real property (3 properties)\n- Investment accounts\n- Small business interest\n- Life insurance proceeds\n\nMust be a licensed CPA with estate tax experience.",
      shortDescription: "Form 706 estate tax return for taxable estate including real property and business interest.",
      skills: "Estate Tax,Form 706,CPA,Estate Planning,Trust Accounting",
      budgetMin: 3000, budgetMax: 6000,
      deadline: future(-10), deliveryTime: "3-4 weeks", status: "CLOSED", categoryId: taxCat.id,
    },
    {
      title: "Construction Company — Job Costing Setup",
      company: "Premier Home Builders",
      description: "Mid-size construction company needs job costing system implemented in QuickBooks Enterprise.\n\nRequirements:\n- Set up job costing structure for 20+ active projects\n- Configure cost codes and cost types\n- Implement budget vs actual reporting\n- WIP (Work in Progress) schedule setup\n- Train office manager on data entry\n- Monthly WIP report preparation",
      shortDescription: "Implement job costing system in QuickBooks Enterprise for a construction company with 20+ projects.",
      skills: "QuickBooks Enterprise,Job Costing,Construction Accounting,WIP,Budgeting",
      budgetMin: 1500, budgetMax: 3500,
      deadline: future(65), deliveryTime: "3-4 weeks", status: "OPEN", categoryId: bookkeepCat.id,
    },
    {
      title: "Employee Benefits Plan Audit (401k)",
      company: "Coastal Healthcare Systems",
      description: "Healthcare company with 200+ employees requires annual audit of 401(k) plan per DOL requirements.\n\nAudit includes:\n- Review of plan financial statements\n- Participant eligibility testing\n- Contribution compliance review\n- Distribution and loan testing\n- Supplemental schedule preparation\n- Form 5500 review\n\nMust have experience with ERISA and employee benefit plan audits.",
      shortDescription: "ERISA annual audit of 401(k) benefit plan for healthcare company with 200+ participants.",
      skills: "ERISA,401k Audit,Employee Benefits,DOL,Form 5500,CPA",
      budgetMin: 5000, budgetMax: 9000,
      deadline: future(80), deliveryTime: "8 weeks", status: "OPEN", categoryId: auditCat.id,
    },
  ];

  const createdJobs = [];
  for (const job of jobsData) {
    const created = await prisma.job.create({ data: job });
    createdJobs.push(created);
  }
  console.log(`✅ Created ${createdJobs.length} jobs (all with future deadlines)`);

  // ── Seed sample bids for the test user so dashboard isn't empty ──────
  // Bid on 3 jobs with different statuses so all dashboard stats show
  const bidJobs = createdJobs.filter(j => j.status === "OPEN").slice(0, 3);

  await prisma.bid.create({
    data: {
      proposedPrice: 2200,
      deliveryTime: "3 weeks",
      coverLetter: "I have 8+ years of corporate tax experience specializing in multi-state filings. I have handled similar engagements for tech companies and can guarantee accurate, timely delivery. My approach involves a thorough review of all financials before filing to maximize deductions.",
      experience: "Licensed CPA with Big 4 background. Handled 50+ corporate tax returns including multi-state filings. Proficient in UltraTax and ProConnect.",
      status: "ACCEPTED",
      userId: testUser.id,
      jobId: bidJobs[0].id,
    },
  });

  await prisma.bid.create({
    data: {
      proposedPrice: 450,
      deliveryTime: "Ongoing monthly",
      coverLetter: "I specialize in bookkeeping for retail businesses and have worked with QuickBooks Online for over 6 years. I understand the unique needs of boutique retailers including seasonal inventory tracking and vendor management. I am detail-oriented and deliver reports by the 5th of every month.",
      experience: "QuickBooks ProAdvisor certified. 6 years bookkeeping experience. Current clients include 4 retail businesses of similar size.",
      status: "PENDING",
      userId: testUser.id,
      jobId: bidJobs[1].id,
    },
  });

  await prisma.bid.create({
    data: {
      proposedPrice: 1100,
      deliveryTime: "2 weeks setup",
      coverLetter: "I have set up payroll systems for 10+ construction companies including prevailing wage compliance. I am certified in both ADP and Gusto and can have your team fully onboarded within 2 weeks. I also handle all quarterly filings going forward.",
      experience: "Payroll specialist with 5 years in construction industry. ADP and Gusto certified. Handled prevailing wage for government contractors.",
      status: "PENDING",
      userId: testUser.id,
      jobId: bidJobs[2].id,
    },
  });

  console.log("✅ Created 3 sample bids (ACCEPTED, PENDING, PENDING) for test user");

  console.log("\n🎉 Seed completed successfully!");
  console.log("─────────────────────────────────────────");
  console.log("TEST CREDENTIALS:");
  console.log("  Email:    test@accountanthub.com");
  console.log("  Password: Test12345");
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
