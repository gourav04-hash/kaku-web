import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill, Calendar, User, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutModal } from "../orders/checkout-modal"

interface PrescriptionCardProps {
    prescription: any
    role?: string
}

export const PrescriptionCard = ({ prescription, role }: PrescriptionCardProps) => {
    const statusColors: any = {
        ACTIVE: "bg-green-100 text-green-700",
        FULFILLED: "bg-blue-100 text-blue-700",
        EXPIRED: "bg-gray-100 text-gray-700",
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                    <Badge className={statusColors[prescription.status] || ""}>
                        {prescription.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">ID: {prescription.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                    <CardTitle className="text-lg">Digital Prescription</CardTitle>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> Dr. {prescription.doctor.user.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {format(new Date(prescription.createdAt), "PPP")}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                    {prescription.items.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                                <Pill className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-sm truncate">{item.medicationName}</h4>
                                    <span className="text-[10px] font-medium bg-primary/20 px-1.5 py-0.5 rounded uppercase">
                                        {item.dosage}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {item.frequency} {item.duration && `• ${item.duration}`}
                                </p>
                                {item.instructions && (
                                    <p className="text-[10px] italic text-muted-foreground mt-1 underline underline-offset-2">
                                        Note: {item.instructions}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {prescription.notes && (
                    <div className="p-3 border-l-4 border-primary bg-primary/5">
                        <p className="text-[11px] leading-relaxed italic">"{prescription.notes}"</p>
                    </div>
                )}
                <div className="pt-2 border-t flex justify-between items-center text-[10px] text-muted-foreground italic">
                    <span>Valid until: {prescription.expiresAt ? format(new Date(prescription.expiresAt), "PPP") : "N/A"}</span>
                    {prescription.refillsAllowed > 0 && (
                        <span>Refills: {prescription.refillsRequested}/{prescription.refillsAllowed}</span>
                    )}
                </div>

                <div className="flex gap-2">
                    {role === "PATIENT" && prescription.status === "ACTIVE" && (
                        <CheckoutModal prescriptionId={prescription.id} items={prescription.items} />
                    )}
                    {role === "PATIENT" && prescription.refillsRequested < prescription.refillsAllowed && (
                        <Button
                            variant="outline"
                            className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                            onClick={async () => {
                                const { requestRefill } = await import("@/lib/actions/prescription")
                                const res = await requestRefill(prescription.id)
                                if (res.success) alert(res.success)
                                if (res.error) alert(res.error)
                            }}
                        >
                            Request Refill
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
