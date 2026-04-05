---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: S3 Infrastructure

## Objective
Set up the AWS SDK and S3 client singleton to enable file uploads.

## Context
- .gsd/SPEC.md
- .gsd/RESEARCH.md
- src/lib/s3.ts (new)

## Tasks

<task type="auto">
  <name>Install AWS SDK</name>
  <files>package.json</files>
  <action>
    - Install `@aws-sdk/client-s3`.
    - Note: We'll use the server-side upload pattern as per RESEARCH.md.
  </action>
  <verify>grep "@aws-sdk/client-s3" package.json</verify>
  <done>AWS SDK is installed.</done>
</task>

<task type="auto">
  <name>Create S3 Client Singleton</name>
  <files>src/lib/s3.ts</files>
  <action>
    - Create a singleton S3 client using environment variables: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
    - Follow the pattern established in `src/lib/prisma.ts` to avoid multiple instances in development.
  </action>
  <verify>Check for S3Client export in src/lib/s3.ts</verify>
  <done>S3 client is initialized and exported.</done>
</task>

## Success Criteria
- [ ] `@aws-sdk/client-s3` installed
- [ ] `src/lib/s3.ts` exists and exports a client
