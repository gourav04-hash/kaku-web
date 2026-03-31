"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function giveConsent(doctorId: string) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "PATIENT") {
        return { error: "Only patients can give consent." }
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!patient) return { error: "Patient profile not found." }

    try {
        await prisma.consent.upsert({
            where: {
                patientId_doctorId: {
                    patientId: patient.id,
                    doctorId: doctorId
                }
            },
            update: { status: "ACTIVE" },
            create: {
                patientId: patient.id,
                doctorId: doctorId,
                status: "ACTIVE"
            }
        })

        revalidatePath("/dashboard")
        return { success: "Consent granted." }
    } catch (error) {
        return { error: "Failed to update consent." }
    }
}

export async function revokeConsent(doctorId: string) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "PATIENT") {
        return { error: "Unauthorized" }
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!patient) return { error: "Patient profile not found." }

    try {
        await prisma.consent.update({
            where: {
                patientId_doctorId: {
                    patientId: patient.id,
                    doctorId: doctorId
                }
            },
            data: { status: "REVOKED" }
        })

        revalidatePath("/dashboard")
        return { success: "Consent revoked." }
    } catch (error) {
        return { error: "Failed to revoke consent." }
    }
}

export async function checkConsent(patientId: string, doctorId: string) {
    const consent = await prisma.consent.findUnique({
        where: {
            patientId_doctorId: {
                patientId,
                doctorId
            }
        }
    })

    return consent?.status === "ACTIVE"
}
