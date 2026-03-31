"use client"

import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, User, ChevronRight } from "lucide-react"
import Link from "next/link"

export function AppointmentList({
    appointments,
    role
}: {
    appointments: any[];
    role: string
}) {
    if (appointments.length === 0) {
        return (
            <div className="p-10 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
                No scheduled appointments found.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {appointments.map((apt) => (
                <Card key={apt.id} className="group hover:border-primary/30 transition-all rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold">
                                    {role === "PATIENT" ? `Dr. ${apt.doctor.user.name}` : apt.patient.user.name}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {format(new Date(apt.startTime), "p")} - {format(new Date(apt.endTime), "p")}
                                    </span>
                                    <span>•</span>
                                    <span>{format(new Date(apt.startTime), "PPP")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Badge variant="outline" className="rounded-lg py-1 px-3 border-2 font-bold uppercase tracking-wider text-[10px]">
                                {apt.status}
                            </Badge>
                            {apt.status === "SCHEDULED" && (
                                <Button className="flex-1 md:flex-initial h-11 px-8 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20" asChild>
                                    <Link href={`/${role.toLowerCase()}/appointments/${apt.id}/room`}>
                                        <Video className="h-4 w-4" />
                                        Join Room
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
