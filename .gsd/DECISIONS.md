# Decision Log

> ADR (Architecture Decision Records) for the Kaku Healthcare Platform

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-05 | Use server-side S3 upload (not presigned client-side) | Preserves existing upload route pattern; simpler for demo |
| 2026-04-05 | Keep NextAuth v4 (not upgrade to Auth.js v5) | Timeline constraint — v4 works, avoid migration risk |
| 2026-04-05 | Deploy to Vercel (not self-hosted) | Auto-scaling, zero-ops, matches Next.js stack |
