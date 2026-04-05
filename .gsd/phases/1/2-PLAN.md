---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Config & Hygiene

## Objective
Clean up project configuration and ensure local artifacts are not leaked.

## Context
- .gsd/SPEC.md
- .gitignore
- next.config.ts

## Tasks

<task type="auto">
  <name>Update Gitignore</name>
  <files>.gitignore</files>
  <action>
    - Add `dev.db`, `dev.db-journal`, and `dev.db-shm`/`dev.db-wal` to `.gitignore`.
    - Ensure `public/uploads` is properly ignored (keep the directory but ignore content).
  </action>
  <verify>git status --ignored</verify>
  <done>Local database and uploads are excluded from git.</done>
</task>

<task type="auto">
  <name>Normalize next.config.ts</name>
  <files>next.config.ts</files>
  <action>
    - Verify `next.config.ts` is clean and ready for production.
    - Ensure no hardcoded development hosts or settings.
  </action>
  <verify>npm run build</verify>
  <done>Next.js config is production-ready.</done>
</task>

## Success Criteria
- [ ] `dev.db` is ignored
- [ ] `next.config.ts` is reviewed and clean
- [ ] Project builds locally without errors
