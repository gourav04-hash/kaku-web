import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAppointments } from "@/lib/actions/appointment"
import prisma from "@/lib/prisma"
import { ConsultationRoom } from "@/components/features/telehealth/consultation-room"
import { redirect } from "next/navigation"

export default async function AppointmentRoomPage({
    params
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const appointment = await prisma.appointment.findUnique({
        where: { id: params.id },
        include: {
            doctor: { include: { user: { select: { name: true } } } },
            patient: { include: { user: { select: { name: true } } } },
        }
    })

    if (!appointment) redirect("/dashboard")

    return (
        <main className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Consultation Session</h1>
                    <p className="text-muted-foreground font-medium">Session ID: {appointment.roomId}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Ongoing Appointment</p>
                    <p className="text-xl font-black text-primary">
                        {(session.user as any)?.role === "DOCTOR" ? appointment.patient.user.name : `Dr. ${appointment.doctor.user.name}`}
                    </p>
                </div>
            </div>

            <ConsultationRoom
                appointment={appointment}
                role={(session.user as any).role}
            />
        </main>
    )
}
