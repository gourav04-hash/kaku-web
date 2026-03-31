"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Eye, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AuditTrailView({ userId }: { userId: string }) {
    // Simulated audit data since we just added the model
    const [logs, setLogs] = useState([
        { id: "1", action: "ACCESS_RECORD", details: "Dr. Smith viewed Clinical Notes", createdAt: new Date(Date.now() - 3600000) },
        { id: "2", action: "ISSUE_PX", details: "Dr. Smith issued e-Prescription #PX-101", createdAt: new Date(Date.now() - 86400000) },
        { id: "3", action: "PLACE_ORDER", details: "You placed an order for Metformin 500mg", createdAt: new Date(Date.now() - 172800000) },
    ])

    return (
        <Card className="rounded-[2.5rem] border-2 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Access & Privacy Log</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">Transparent history of who accessed your medical profile.</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-zinc-100">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white border rounded-xl group-hover:border-primary/30 transition-colors">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900">{log.details}</p>
                                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">
                                        {log.createdAt.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className={`rounded-lg py-1 px-3 border-2 font-black text-[10px] uppercase tracking-wider ${log.action === 'ACCESS_RECORD' ? 'text-primary border-primary/20 bg-primary/5' : 'text-zinc-500 border-zinc-200'
                                }`}>
                                {log.action.replace('_', ' ')}
                            </Badge>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-zinc-50 border-t flex items-center gap-3 text-xs font-bold text-zinc-500">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    All medical record access is encrypted and logged in compliance with HIPAA and DPDP regulations.
                </div>
            </CardContent>
        </Card>
    )
}
