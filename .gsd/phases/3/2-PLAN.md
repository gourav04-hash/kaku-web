---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: Production Database Strategy

## Objective
Document and prepare the transition from SQLite (local) to PostgreSQL (production).

## Context
- prisma/schema.prisma
- .gsd/SPEC.md

## Tasks

<task type="checkpoint:human-verify">
  <name>Confirm Postgres Transition</name>
  <files>prisma/schema.prisma</files>
  <action>
    - The project uses `sqlite` for local development. Vercel requires `postgresql`.
    - Note: This requires changing the `provider` in `schema.prisma` before deployment.
    - Discuss with the user if they want a `db-prod.prisma` or if they will switch manually during deployment.
  </action>
  <verify>User confirmation on manual switch vs automated strategy.</verify>
  <done>Production database strategy is finalized.</done>
</task>

<task type="auto">
  <name>Document Environment Requirements</name>
  <files>.env.example</files>
  <action>
    - Add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` (Vercel Postgres defaults) to documentation if desired.
  </action>
  <verify>Check .env.example</verify>
  <done>Production environment variables are documented.</done>
</task>

## Success Criteria
- [ ] Database transition strategy approved
- [ ] Production environment variables documented
