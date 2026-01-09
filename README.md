# Sách Khánh Hòa ERP - Employee Evaluation Management System

A comprehensive employee evaluation management system built with Next.js 15, featuring a strict 3-page workflow, manager review capabilities, and admin oversight dashboard.

## 🚀 Features

### Employee Workflow
- **Page 1 - Planning**: Set monthly targets and goals
- **Page 2 - Reporting**: Self-assess performance with sub-task checklists
- **Page 3 - KPI Review**: Review scores, weights, and submit for approval

### Manager Capabilities
- Review submitted evaluations from direct reports
- Score each task individually
- Add comments and approve/reject evaluations

### Admin Dashboard
- Overview of all evaluations across departments
- Filter by status, department, and period
- View self-scores, manager scores, and final ratings

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js
- **UI**: Premium card-based design with animations

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sách-khánh-hòa-erp-3
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run development server:
```bash
npm run dev
```

## 🔑 Default Credentials

- **Admin**: `admin@skh.vn` / `admin123`
- **Employee**: `nv@skh.vn` / `password123`

## 📋 Evaluation Logic

### Strict 3-Page Independent Flow

**Page 1 - Plan (Current Month)**
- Input: Task Name, Target Quantity
- No weights or coefficients at this stage

**Page 2 - Report (Previous Month)**
- Input: Actual Value, Coefficient
- Formula: `convertedScore = actualValue × coefficient`
- Independent from Page 1 data

**Page 3 - KPI (Previous Month)**
- Input: Weight (tỷ trọng)
- Formula: `weightedScore = convertedScore × weight`
- Total KPI: `sum(all weightedScores)`
- Ranking: A (≥90), B (≥75), C (≥50), D (<50)

## 🔐 Role-Based Access Control

- **SYS**: System administrator (full access)
- **DM**: Department manager
- **TL**: Team leader
- **EMP**: Employee

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── plan/          # Planning page
│   │   ├── report/        # Report page
│   │   ├── kpi/           # KPI review page
│   │   ├── approval/      # Manager review
│   │   └── admin/         # Admin dashboard
│   ├── api/
│   │   ├── auth/          # NextAuth config
│   │   ├── evaluations/   # Evaluation CRUD
│   │   └── approvals/     # Manager approvals
│   └── auth/signin/       # Login page
├── components/
│   ├── Sidebar.tsx
│   └── Header.tsx
└── lib/
    └── prisma.ts
```

## 🎨 Design Features

- Premium card-based UI
- Dark mode sub-task inputs
- Smooth animations and transitions
- Responsive design for all devices
- Color-coded status indicators

## 📝 License

MIT

## 👥 Contributors

Built with ❤️ for Sách Khánh Hòa
