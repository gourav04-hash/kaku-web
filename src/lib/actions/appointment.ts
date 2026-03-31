"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { addMinutes, startOfDay, endOfDay, isWithinInterval, parse } from "date-fns"

export async function bookAppointment(
    doctorId: string,
    startTime: Date,
    type: string = "VIDEO",
    notes?: string
) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "PATIENT") {
        return { error: "Only patients can book appointments." }
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!patient) return { error: "Patient profile not found." }

    try {
        const endTime = addMinutes(new Date(startTime), 30) // Default 30 min slot

        // Check availability (simplified for now - just check collisions)
        const collision = await prisma.appointment.findFirst({
            where: {
                doctorId,
                status: "SCHEDULED",
                OR: [
                    { startTime: { lte: startTime }, endTime: { gt: startTime } },
                    { startTime: { lt: endTime }, endTime: { gte: endTime } }
                ]
            }
        })

        if (collision) {
            return { error: "This slot is already booked." }
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                startTime,
                endTime,
                type,
                notes,
                roomId: type === "VIDEO" ? `room-${Math.random().toString(36).slice(2, 9)}` : null
            }
        })

        revalidatePath("/dashboard")
        return { success: "Appointment booked successfully!", appointment }
    } catch (error) {
        return { error: "Failed to book appointment." }
    }
}

export async function getAppointments(role: string, userId: string) {
    let where: any = {}

    if (role === "PATIENT") {
        const profile = await prisma.patientProfile.findUnique({ where: { userId } })
        if (!profile) return { error: "Profile not found" }
        where.patientId = profile.id
    } else if (role === "DOCTOR") {
        const profile = await prisma.doctorProfile.findUnique({ where: { userId } })
        if (!profile) return { error: "Profile not found" }
        where.doctorId = profile.id
    }

    try {
        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                doctor: { include: { user: { select: { name: true, image: true } } } },
                patient: { include: { user: { select: { name: true, image: true } } } },
            },
            orderBy: { startTime: "asc" }
        })
        return { success: true, appointments }
    } catch (error) {
        return { error: "Failed to fetch appointments" }
    }
}

export async function getDoctors() {
    try {
        const doctors = await prisma.doctorProfile.findMany({
            include: {
                user: { select: { name: true, image: true, email: true } }
            }
        })
        return { success: true, doctors }
    } catch (error) {
        return { error: "Failed to fetch doctors" }
    }
}
