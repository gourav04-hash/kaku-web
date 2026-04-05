# Research Notes

> Generated 2026-04-05

## Vercel Deployment — Next.js + Prisma

### Key findings:
- Vercel auto-detects Next.js — no special `vercel.json` needed for App Router
- `postinstall: prisma generate` in `package.json` already handles Prisma client generation during Vercel build ✅
- Environment variables set via Vercel Dashboard → Settings → Environment Variables
- `DATABASE_URL` must point to a PostgreSQL instance (Neon or Vercel Postgres recommended)
- Prisma needs `?pgbouncer=true` appended if using Neon's pooled connection
- Special Vercel env vars available: `VERCEL`, `VERCEL_ENV`, `NEXT_PUBLIC_VERCEL_URL`
- `NEXTAUTH_URL` should be set to the production domain (e.g. `https://kaku.vercel.app`)

### Steps to deploy:
1. Push repo to GitHub
2. Import project in Vercel dashboard
3. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AWS_*`
4. Vercel runs `npm install` → `postinstall` (prisma generate) → `next build`
5. Deploy!

### Gotchas:
- **No local filesystem on Vercel** — `public/uploads` won't persist across deploys → must use S3
- `debug: true` in NextAuth config will log sensitive data → must disable
- Middleware runs at Edge — `withAuth` from NextAuth works on Edge but `prisma` does NOT

---

## AWS S3 Upload — from Next.js Server Actions

### Packages needed:
```
@aws-sdk/client-s3
@aws-sdk/s3-request-presigner
```

### Approach: Server-side upload (current pattern preserved)
The existing upload route receives `FormData` → reads buffer → writes to filesystem.
We replace the filesystem write with `PutObjectCommand` to S3.

### Code pattern:
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET!,
  Key: `uploads/${Date.now()}-${filename}`,
  Body: buffer,
  ContentType: file.type,
})

await s3.send(command)
const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${key}`
```

### Environment variables:
| Variable | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret |
| `AWS_S3_BUCKET` | Target bucket name |
| `AWS_REGION` | Bucket region (e.g. `ap-south-1`) |

### S3 CORS configuration needed:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST"],
    "AllowedOrigins": ["https://kaku.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```
