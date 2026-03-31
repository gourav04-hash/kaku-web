import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

        const filename = `${Date.now()}-${file.name}`
        const path = join(process.cwd(), "public/uploads", filename)
        await writeFile(path, buffer)

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`,
            name: file.name,
            fileType: file.type
        })
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
