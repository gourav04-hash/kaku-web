"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["PATIENT", "DOCTOR", "PHARMACIST"]),
})

export async function register(formData: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(formData)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { name, email, password, role } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        })

        // Create profile based on role
        if (role === "PATIENT") {
            await prisma.patientProfile.create({ data: { userId: user.id } })
        } else if (role === "DOCTOR") {
            await prisma.doctorProfile.create({
                data: {
                    userId: user.id,
                    licenseNumber: `TEMP-${user.id.slice(-5)}` // Temporary placeholder
                }
            })
        } else if (role === "PHARMACIST") {
            await prisma.pharmacistProfile.create({
                data: {
                    userId: user.id,
                    licenseNumber: `TEMP-PH-${user.id.slice(-5)}` // Temporary placeholder
                }
            })
        }

        return { success: "User created!" }
    } catch (error) {
        return { error: "Something went wrong!" }
    }
}
