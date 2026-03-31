"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function addMedicalEntry(
    patientId: string,
    content: string,
    type: string = "NOTE",
    documents: any[] = []
) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "DOCTOR") {
        return { error: "Unauthorized. Only doctors can add medical records." }
    }

    const doctor = await prisma.doctorProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!doctor) {
        return { error: "Doctor profile not found." }
    }

    try {
        const entry = await prisma.medicalRecordEntry.create({
            data: {
                patientId,
                doctorId: doctor.id,
                content,
                type,
                documents: {
                    create: documents.map(doc => ({
                        name: doc.name,
                        url: doc.url,
                        fileType: doc.fileType,
                    }))
                }
            }
        })

        revalidatePath("/dashboard")
        return { success: "Medical record added successfully!", entryId: entry.id }
    } catch (error) {
        console.error("EMR Error:", error)
        return { error: "Failed to create medical record." }
    }
}

export async function getPatientHistory(patientId: string) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { error: "Unauthorized" }
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole === "PATIENT") {
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId }
        })
        if (!patientProfile || patientProfile.id !== patientId) {
            return { error: "Access denied." }
        }
    }

    try {
        const history = await prisma.medicalRecordEntry.findMany({
            where: { patientId },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                },
                diagnoses: true,
                documents: true,
            },
            orderBy: { createdAt: "desc" }
        })

        return { success: true, history }
    } catch (error) {
        return { error: "Failed to fetch medical history." }
    }
}

export async function getPatientProfileByUserId(userId: string) {
    try {
        const profile = await prisma.patientProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        })
        return profile
    } catch (error) {
        return null
    }
}
