"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { bookAppointment } from "@/lib/actions/appointment"
import { format } from "date-fns"
import { CalendarIcon, Clock, Video, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookingDialog({
    doctor,
    open,
    onOpenChange
}: {
    doctor: any;
    open: boolean;
    onOpenChange: (open: boolean) => void
}) {
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"]

    const handleBooking = async () => {
        if (!date || !time) return
        setLoading(true)

        const [hours, minutes] = time.split(":").map(Number)
        const bookingDate = new Date(date)
        bookingDate.setHours(hours, minutes, 0, 0)

        const result = await bookAppointment(doctor.id, bookingDate)

        if (result.error) {
            setError(result.error)
        } else {
            onOpenChange(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Schedule a video consultation with Dr. {doctor.user.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Select Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12 rounded-xl",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                                <Button
                                    key={slot}
                                    variant={time === slot ? "default" : "outline"}
                                    className="rounded-lg h-10"
                                    onClick={() => setTime(slot)}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={handleBooking} disabled={loading || !date || !time} className="w-full h-12 rounded-xl">
                        {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
