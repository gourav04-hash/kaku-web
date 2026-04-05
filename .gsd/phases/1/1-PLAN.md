---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Auth & Middleware Hardening

## Objective
Harden the authentication layer by disabling debug mode, improving type safety, and verifying middleware logic.

## Context
- .gsd/SPEC.md
- src/lib/auth.ts
- src/middleware.ts
- src/types/next-auth.d.ts

## Tasks

<task type="auto">
  <name>Harden NextAuth Config</name>
  <files>src/lib/auth.ts</files>
  <action>
    - Set `debug: false` in `authOptions`.
    - Remove `(user as any).role` and `(session.user as any)` casts in `jwt` and `session` callbacks. The types are already extended in `src/types/next-auth.d.ts`.
  </action>
  <verify>npm run lint</verify>
  <done>NextAuth debug is false and auth.ts is free of 'any' casts for user/session.</done>
</task>

<task type="auto">
  <name>Verify Middleware</name>
  <files>src/middleware.ts</files>
  <action>
    - Audit `middleware` function to ensure all role routes are correctly protected.
    - Confirm `matcher` config covers all necessary paths.
  </action>
  <verify>Check for any missed role routes (e.g., patient routes might need more coverage).</verify>
  <done>Middleware correctly enforces RBAC for all roles.</done>
</task>

## Success Criteria
- [ ] No `any` casts in `auth.ts`
- [ ] `debug: false` in `auth.ts`
- [ ] Middleware covers all role-based paths
