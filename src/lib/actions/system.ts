"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createNotification(userId: string, title: string, message: string, type: string, link?: string) {
    try {
        await prisma.notification.create({
            data: { userId, title, message, type, link }
        })
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create notification" }
    }
}

export async function getNotifications() {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: "desc" },
            take: 20
        })
        return { success: true, notifications }
    } catch (error) {
        return { error: "Failed to fetch notifications" }
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.notification.update({
            where: { id },
            data: { read: true }
        })
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update notification" }
    }
}

export async function createAuditLog(action: string, details?: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.auditLog.create({
            data: {
                userId: (session.user as any).id,
                action,
                details
            }
        })
        return { success: true }
    } catch (error) {
        return { error: "Failed to create audit log" }
    }
}
