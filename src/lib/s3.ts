import { S3Client } from "@aws-sdk/client-s3"

const s3ClientSingleton = () => {
    return new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    })
}

type S3ClientSingleton = ReturnType<typeof s3ClientSingleton>

const globalForS3 = globalThis as unknown as {
    s3Client: S3ClientSingleton | undefined
}

const s3Client = globalForS3.s3Client ?? s3ClientSingleton()

export default s3Client

if (process.env.NODE_ENV !== "production") globalForS3.s3Client = s3Client
