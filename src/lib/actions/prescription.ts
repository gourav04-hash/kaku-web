"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function requestRefill(prescriptionId: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        const px = await prisma.prescription.findUnique({ where: { id: prescriptionId } })
        if (!px) return { error: "Prescription not found" }
        if (px.refillsRequested >= px.refillsAllowed) {
            return { error: "No refills remaining for this prescription." }
        }

        // Need to get the doctor's userId from the doctorProfile
        const doctorProfile = await prisma.doctorProfile.findUnique({
            where: { id: px.doctorId },
            select: { userId: true }
        })

        if (!doctorProfile) {
            return { error: "Doctor profile associated with prescription not found." }
        }

        await prisma.prescription.update({
            where: { id: prescriptionId },
            data: { refillsRequested: { increment: 1 } }
        })

        await prisma.notification.create({
            data: {
                userId: doctorProfile.userId, // Use the doctor's userId
                title: "Refill Request",
                message: `Patient has requested a refill for prescription #${px.id.slice(-6).toUpperCase()}`,
                type: "PRESCRIPTION"
            }
        })

        revalidatePath("/patient/prescriptions")
        return { success: "Refill requested successfully!" }
    } catch (error) {
        console.error("Refill Request Error:", error)
        return { error: "Failed to request refill." }
    }
}

export async function createPrescription(
    patientId: string,
    items: { medicationName: string; dosage: string; frequency: string; duration?: string; instructions?: string }[],
    notes?: string
) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "DOCTOR") {
        return { error: "Unauthorized. Only doctors can issue prescriptions." }
    }

    const doctor = await prisma.doctorProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!doctor) {
        return { error: "Doctor profile not found." }
    }

    try {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 3) // Valid for 3 months by default

        const prescription = await prisma.prescription.create({
            data: {
                patientId,
                doctorId: doctor.id,
                notes,
                expiresAt,
                items: {
                    create: items
                }
            },
            include: {
                items: true
            }
        })

        revalidatePath("/dashboard")
        return { success: "Prescription issued successfully!", prescriptionId: prescription.id }
    } catch (error) {
        console.error("Prescription Error:", error)
        return { error: "Failed to issue prescription." }
    }
}

export async function getPrescriptions(patientId?: string) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { error: "Unauthorized" }
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    let where: any = {}

    if (userRole === "PATIENT") {
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId }
        })
        if (!patientProfile) return { error: "Patient profile not found." }
        where.patientId = patientProfile.id
    } else if (userRole === "DOCTOR") {
        const doctorProfile = await prisma.doctorProfile.findUnique({
            where: { userId }
        })
        if (!doctorProfile) return { error: "Doctor profile not found." }
        where.doctorId = doctorProfile.id
        if (patientId) where.patientId = patientId
    }

    try {
        const prescriptions = await prisma.prescription.findMany({
            where,
            include: {
                items: true,
                doctor: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                },
                patient: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return { success: true, prescriptions }
    } catch (error) {
        return { error: "Failed to fetch prescriptions." }
    }
}
