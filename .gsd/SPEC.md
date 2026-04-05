# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

Make the Kaku Digital Healthcare & Online Pharmacy platform **production-ready** — clean up technical debt, wire real S3 file uploads, harden auth config, and prepare for a successful Vercel deployment. This is a **polish & ship** milestone, not a feature expansion.

## Goals

1. **Production cleanup** — Disable debug mode, fix type casts, address code hygiene
2. **S3 file uploads** — Replace local `fs.writeFile` uploads with AWS S3 via presigned URLs
3. **Vercel deployment readiness** — Validate build, environment variables, Prisma generation, and PostgreSQL connectivity
4. **Remove dev artifacts** — Clean `dev.db`, local upload reliance, and hardcoded values

## Non-Goals (Out of Scope)

- Payment gateway integration (Razorpay) — future phase
- Video SDK real signaling — placeholder is acceptable for demo
- Test suite creation — important but not this milestone
- Mobile app / PWA features
- AI/ML, analytics dashboards, or wearable integration
- FHIR/HL7 compliance
- Multi-tenant or family account linking

## Users

- **Primary:** Development team deploying to Vercel for client demo
- **End users (demo):** Patients, Doctors, Pharmacists, Admins — exercising the full clinical workflow

## Constraints

- **Timeline:** End of this week (~2 days)
- **Stack locked:** Next.js 16, React 19, Prisma 5, NextAuth 4 — no major upgrades
- **Hosting:** Vercel (serverless functions, Edge middleware)
- **Database:** PostgreSQL (Neon or Vercel Postgres)
- **File storage:** AWS S3 (requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`)

## Success Criteria

- [ ] `next build` succeeds with zero errors
- [ ] Upload route writes files to S3, returns public URL
- [ ] Vercel deployment succeeds and app loads over HTTPS
- [ ] Auth debug mode disabled in production
- [ ] No local filesystem dependencies for uploaded files
- [ ] All environment variables documented in `.env.example`
