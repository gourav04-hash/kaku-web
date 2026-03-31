"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getLabReports() {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    const patient = await prisma.patientProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!patient) return { error: "Patient profile not found" }

    try {
        const reports = await prisma.labReport.findMany({
            where: { patientId: patient.id },
            include: {
                test: true
            },
            orderBy: { createdAt: "desc" }
        })
        return { success: true, reports }
    } catch (error) {
        return { error: "Failed to fetch lab reports" }
    }
}

export async function createLabReport(patientId: string, testId: string, results?: string) {
    try {
        const report = await prisma.labReport.create({
            data: {
                patientId,
                testId,
                results,
                status: results ? "READY" : "PENDING"
            }
        })
        revalidatePath("/dashboard")
        return { success: true, reportId: report.id }
    } catch (error) {
        return { error: "Failed to create lab report" }
    }
}
