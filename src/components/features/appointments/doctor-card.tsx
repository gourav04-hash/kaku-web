"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, Star, Clock } from "lucide-react"
import { BookingDialog } from "./booking-dialog"

export function DoctorCard({ doctor }: { doctor: any }) {
    const [bookingOpen, setBookingOpen] = useState(false)

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-primary/20 group">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={doctor.user.image} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                            {doctor.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                            Dr. {doctor.user.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-primary/5 text-primary">
                                {doctor.specialization || "General Practitioner"}
                            </Badge>
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                            <Star className="h-4 w-4 fill-current" /> 4.9
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black">
                            {doctor.experience || 5} yrs Exp.
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Next: Today, 2 PM
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <Video className="h-4 w-4" /> Available
                        </div>
                    </div>
                    <Button
                        className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-primary/20"
                        onClick={() => setBookingOpen(true)}
                    >
                        Book Appointment
                    </Button>
                </CardContent>
            </Card>

            <BookingDialog
                doctor={doctor}
                open={bookingOpen}
                onOpenChange={setBookingOpen}
            />
        </>
    )
}
