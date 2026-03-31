"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createOrderFromPrescription(
    prescriptionId: string,
    deliveryAddr: string
) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "PATIENT") {
        return { error: "Only patients can fulfill prescriptions." }
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { userId: (session.user as any).id }
    })

    if (!patient) return { error: "Patient profile not found." }

    try {
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { items: true }
        })

        if (!prescription || prescription.patientId !== patient.id) {
            return { error: "Prescription not found or unauthorized." }
        }

        if (prescription.status === "FULFILLED") {
            return { error: "This prescription has already been fulfilled." }
        }

        // Calculate total layout stub (in a real app, you'd fetch prices from a Medication catalog)
        const totalAmount = prescription.items.length * 10 // Stub price

        const order = await prisma.order.create({
            data: {
                patientId: patient.id,
                prescriptionId: prescription.id,
                totalAmount,
                deliveryAddr,
                status: "PENDING",
                items: {
                    create: prescription.items.map(item => ({
                        medName: item.medicationName,
                        quantity: 1, // Default from prescription
                        priceAtOrder: 10, // Stub price
                    }))
                }
            }
        })

        // Update prescription status
        await prisma.prescription.update({
            where: { id: prescriptionId },
            data: { status: "FULFILLED" }
        })

        revalidatePath("/dashboard")
        revalidatePath("/patient/prescriptions")
        return { success: "Order created successfully!", orderId: order.id }
    } catch (error) {
        console.error("Order Error:", error)
        return { error: "Failed to create order." }
    }
}

export async function getOrders() {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    let where: any = {}

    if (userRole === "PATIENT") {
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId }
        })
        if (!patientProfile) return { error: "Patient profile not found." }
        where.patientId = patientProfile.id
    } else if (userRole === "PHARMACIST") {
        // Pharmacists can see all orders
    } else {
        return { error: "Unauthorized" }
    }

    try {
        const orders = await prisma.order.findMany({
            where,
            include: {
                items: true,
                patient: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                },
                prescription: true
            },
            orderBy: { createdAt: "desc" }
        })

        return { success: true, orders }
    } catch (error) {
        return { error: "Failed to fetch orders." }
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "PHARMACIST") {
        return { error: "Unauthorized. Only pharmacists can update order status." }
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        revalidatePath("/dashboard")
        return { success: "Order status updated." }
    } catch (error) {
        return { error: "Failed to update order status." }
    }
}
