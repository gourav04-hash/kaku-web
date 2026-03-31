"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, TrendingUp, Calendar, FlaskConical } from "lucide-react"

export function LabReportCard({ report }: { report: any }) {
    const statusColors: any = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        READY: "bg-emerald-100 text-emerald-700 border-emerald-200"
    }

    return (
        <Card className="rounded-3xl border-2 hover:border-primary/30 transition-all overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <FlaskConical className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">{report.test.name}</CardTitle>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Report ID: {report.id.slice(-6)}</p>
                    </div>
                </div>
                <Badge className={`${statusColors[report.status]} border-2 font-bold px-3 py-1 rounded-lg`}>
                    {report.status}
                </Badge>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Sample Type</p>
                        <p className="font-bold">{report.test.sampleType}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Collected On</p>
                        <p className="font-bold">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {report.status === "READY" ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Key Findings</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed italic line-clamp-2">
                                {report.results || "All markers within normal physiological ranges. Consult advisor for details."}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/20" asChild>
                                <a href={report.documentUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" /> Download PDF
                                </a>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                        <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm font-bold text-muted-foreground">Results are being processed</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Expected soon.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
