# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 — Production Ready

## Must-Haves (from SPEC)

- [ ] S3 file uploads replacing local filesystem
- [ ] Production auth config (debug off, proper types)
- [ ] Clean Vercel build (`next build` zero errors)
- [ ] All env vars documented
- [ ] Successful Vercel deployment

## Phases

### Phase 1: Production Cleanup
**Status**: ⬜ Not Started
**Objective**: Fix tech debt items that affect production safety
**Tasks:**
- Disable `debug: true` in NextAuth config
- Extend NextAuth types properly (remove `as any` casts)
- Audit middleware for correctness
- Remove `dev.db` from deployment
- Review & clean `next.config.ts`

### Phase 2: S3 File Uploads
**Status**: ⬜ Not Started
**Objective**: Replace local fs uploads with AWS S3
**Tasks:**
- Install `@aws-sdk/client-s3`
- Create `src/lib/s3.ts` — S3 client singleton
- Rewrite `/api/upload/route.ts` to use S3 `PutObjectCommand`
- Update `.env.example` with all AWS variables
- Verify upload returns valid S3 URL

### Phase 3: Vercel Deployment
**Status**: ⬜ Not Started
**Objective**: Successful production deploy to Vercel
**Tasks:**
- Run `next build` locally — fix any errors
- Push to GitHub repo (`gourav04-hash/kaku-web`)
- Import project in Vercel dashboard
- Configure environment variables (DATABASE_URL, NEXTAUTH_*, AWS_*)
- Validate deployment: auth flow, upload flow, role routing

### Phase 4: Polish & Documentation
**Status**: ⬜ Not Started
**Objective**: Final cleanup and developer docs
**Tasks:**
- Update README.md with deploy instructions
- Update `.env.example` with all required variables
- Add `.gitignore` entries for `dev.db`, `public/uploads`
- Final smoke test on deployed URL
