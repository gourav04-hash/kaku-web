import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "@/lib/s3"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
        const bucket = process.env.AWS_S3_BUCKET || ""
        const region = process.env.AWS_REGION || "us-east-1"
        const key = `uploads/${filename}`

        await s3Client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: file.type
        }))

        // Note: This assumes a public bucket or a CloudFront distribution
        // For production, consider using presigned GET URLs if the bucket is private
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`

        return NextResponse.json({
            success: true,
            url: url,
            name: file.name,
            fileType: file.type
        })
    } catch (error) {
        console.error("S3 Upload Error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

