---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: S3 Route Integration

## Objective
Migrate the existing upload route from local filesystem to AWS S3.

## Context
- src/app/api/upload/route.ts
- src/lib/s3.ts
- .env.example

## Tasks

<task type="auto">
  <name>Rewrite Upload Route</name>
  <files>src/app/api/upload/route.ts</files>
  <action>
    - Import `s3Client` from `@/lib/s3`.
    - Import `PutObjectCommand` from `@aws-sdk/client-s3`.
    - Replace `fs.writeFile` logic with `s3Client.send(new PutObjectCommand(...))`.
    - Update the returned URL to the S3 public URL format.
    - Reference: .gsd/RESEARCH.md
  </action>
  <verify>npm run build</verify>
  <done>Route uses S3 for storage and returns a public URL.</done>
</task>

<task type="auto">
  <name>Update Environment Templates</name>
  <files>.env.example</files>
  <action>
    - Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, and `AWS_REGION` to `.env.example`.
  </action>
  <verify>cat .env.example</verify>
  <done>Environmental variables for S3 are documented.</done>
</task>

## Success Criteria
- [ ] `/api/upload` uses S3 for storage
- [ ] `.env.example` is updated
- [ ] Zero local filesystem dependencies for uploads
