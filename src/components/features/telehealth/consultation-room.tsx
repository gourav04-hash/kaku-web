"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Video,
    Mic,
    MicOff,
    VideoOff,
    PhoneOff,
    MessageSquare,
    User,
    ShieldCheck,
    Settings,
    MoreVertical
} from "lucide-react"
import { MedicalEntryForm } from "@/components/features/emr/entry-form"
import { PrescriptionForm } from "@/components/features/prescriptions/prescription-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConsultationRoom({
    appointment,
    role
}: {
    appointment: any;
    role: string
}) {
    const [streamActive, setStreamActive] = useState(true)
    const [micActive, setMicActive] = useState(true)
    const [callStatus, setCallStatus] = useState("Connected")

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
            {/* Video Section */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="relative flex-1 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800">
                    {/* Main Remote Video (Simulated) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                        {streamActive ? (
                            <div className="text-center">
                                <div className="h-32 w-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <User className="h-16 w-16 text-primary" />
                                </div>
                                <p className="text-zinc-400 font-medium">
                                    {role === "DOCTOR" ? appointment.patient.user.name : `Dr. ${appointment.doctor.user.name}`}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <VideoOff className="h-12 w-12 text-zinc-600" />
                                <span className="text-zinc-500">Video Paused</span>
                            </div>
                        )}
                    </div>

                    {/* Local Self-View */}
                    <div className="absolute bottom-6 right-6 w-48 h-32 bg-zinc-800 rounded-2xl border-2 border-zinc-700 shadow-xl overflow-hidden z-10">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <User className="h-8 w-8 text-zinc-600" />
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-[10px] text-white rounded-md">
                            You (Me)
                        </div>
                    </div>

                    {/* Connection Overlay */}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1 flex items-center gap-1.5 backdrop-blur-md">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            {callStatus}
                        </Badge>
                        <Badge className="bg-white/10 text-white border-none px-3 py-1 backdrop-blur-md">
                            HD 1080p
                        </Badge>
                    </div>

                    {/* Call Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-800/80 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
                        <Button
                            variant="secondary"
                            size="icon"
                            className={cn("rounded-2xl h-12 w-12", !micActive && "bg-destructive text-destructive-foreground")}
                            onClick={() => setMicActive(!micActive)}
                        >
                            {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className={cn("rounded-2xl h-12 w-12", !streamActive && "bg-destructive text-destructive-foreground")}
                            onClick={() => setStreamActive(!streamActive)}
                        >
                            {streamActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                        <Button variant="secondary" size="icon" className="rounded-2xl h-12 w-12">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <div className="w-px h-8 bg-white/10 mx-2" />
                        <Button variant="destructive" size="icon" className="rounded-2xl h-12 w-12 shadow-lg shadow-destructive/20">
                            <PhoneOff className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    This consultation is end-to-end encrypted and HIPAA-compliant.
                </div>
            </div>

            {/* Clinical Section (Only Visible for Doctor) */}
            <div className="w-full lg:w-[450px] flex flex-col gap-4 overflow-y-auto pr-2">
                {role === "DOCTOR" ? (
                    <Tabs defaultValue="notes" className="w-full">
                        <TabsList className="w-full p-1 bg-muted rounded-2xl mb-4">
                            <TabsTrigger value="notes" className="flex-1 rounded-xl">Clinical Notes</TabsTrigger>
                            <TabsTrigger value="prescription" className="flex-1 rounded-xl">Prescription</TabsTrigger>
                        </TabsList>
                        <TabsContent value="notes">
                            <MedicalEntryForm patientId={appointment.patientId} />
                        </TabsContent>
                        <TabsContent value="prescription">
                            <PrescriptionForm patientId={appointment.patientId} />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <Card className="rounded-3xl border-2 shadow-sm h-full">
                        <CardContent className="p-8 text-center space-y-6 flex flex-col justify-center h-full">
                            <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto">
                                <Video className="h-12 w-12 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Consultation Active</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Please keep your video and microphone active. Your doctor will issue clinical notes and prescriptions directly to your profile.
                                </p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <Button variant="outline" className="w-full rounded-2xl">View My Profile</Button>
                                <Button variant="ghost" className="w-full rounded-2xl">Technical Support</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
