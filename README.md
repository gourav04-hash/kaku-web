# Kaku Healthcare Platform

A production-ready healthcare management platform built with Next.js 16, React 19, Prisma 5, and NextAuth 4.

## 🚀 Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in the required values:
- `DATABASE_URL`: Your database connection string.
- `NEXTAUTH_SECRET`: Secret for session encryption.
- `AWS_*`: Credentials for S3 file storage.

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Initialization
Local development (SQLite):
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

## 🛠 Production Deployment

### Database Provider Toggle
Since local development uses SQLite, you must switch the Prisma provider for production (PostgreSQL):

**To switch to PostgreSQL:**
```bash
npm run prisma:pg
```

**To switch back to SQLite:**
```bash
npm run prisma:sqlite
```

### Deployment on Vercel
1. Connect your repository to Vercel.
2. Configure all environment variables from `.env.example`.
3. Ensure the `postinstall` script runs `prisma generate`.

## 📁 Key Features
- **Authentication**: JWT-based RBAC (Doctor, Patient, Pharmacist, Admin).
- **EMR**: Patient history, medical records, and document uploads via S3.
- **S3 Storage**: Stateless file uploads for medical documents.
- **Scheduling**: Appointment management.
- **Verification**: Zero-lint, high-performance production build using Next.js 16 Turbopack.

---
*Developed for Kaku Healthcare Production Demo (April 2026).*
