import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface TimelineProps {
    history: any[]
}

export const MedicalTimeline = ({ history }: TimelineProps) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                No medical records found for this patient.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {history.map((entry) => (
                <Card key={entry.id} className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    {entry.type === "DIAGNOSIS" ? "Diagnosis" : "Consultation Note"}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    By Dr. {entry.doctor.user.name} • {format(new Date(entry.createdAt), "PPP")}
                                </p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                                ID: {entry.id.slice(-6)}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {entry.content}
                        </p>
                        {entry.diagnoses && entry.diagnoses.length > 0 && (
                            <div className="mt-4 pt-4 border-t space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diagnoses</h4>
                                {entry.diagnoses.map((d: any) => (
                                    <div key={d.id} className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                                            {d.code || "ICD"}
                                        </span>
                                        <span className="text-sm">{d.description}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {entry.documents && entry.documents.length > 0 && (
                            <div className="mt-4 pt-4 border-t space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attachments</h4>
                                <div className="flex flex-wrap gap-3">
                                    {entry.documents.map((doc: any) => (
                                        <a
                                            key={doc.id}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition-colors"
                                        >
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-medium truncate max-w-[150px]">{doc.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
