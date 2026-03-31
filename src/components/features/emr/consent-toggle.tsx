"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { giveConsent, revokeConsent } from "@/lib/actions/consent"

interface ConsentToggleProps {
    doctorId: string
    initialConsent: boolean
    doctorName: string
}

export const ConsentToggle = ({ doctorId, initialConsent, doctorName }: ConsentToggleProps) => {
    const [isPending, startTransition] = useTransition()
    const [consent, setConsent] = useState(initialConsent)

    const handleToggle = (checked: boolean) => {
        setConsent(checked)
        startTransition(async () => {
            if (checked) {
                await giveConsent(doctorId)
            } else {
                await revokeConsent(doctorId)
            }
        })
    }

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Consent for Dr. {doctorName}</Label>
                <p className="text-xs text-muted-foreground">
                    Allow this doctor to view and add to your medical records.
                </p>
            </div>
            <Switch
                checked={consent}
                onCheckedChange={handleToggle}
                disabled={isPending}
            />
        </div>
    )
}
