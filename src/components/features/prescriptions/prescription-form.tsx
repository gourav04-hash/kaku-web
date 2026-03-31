"use client"

import { useState } from "react"
import { createPrescription } from "@/lib/actions/prescription"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export const PrescriptionForm = ({ patientId }: { patientId: string }) => {
    const [items, setItems] = useState([{ medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }])
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const addItem = () => {
        setItems([...items, { medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items]
            ; (newItems[index] as any)[field] = value
        setItems(newItems)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const result = await createPrescription(patientId, items, notes)

        if (result.error) {
            setError(result.error)
        } else {
            setItems([{ medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }])
            setNotes("")
        }
        setLoading(false)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Issue New Prescription</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                                {items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Medication Name</Label>
                                        <Input
                                            placeholder="e.g. Amoxicillin"
                                            required
                                            value={item.medicationName}
                                            onChange={(e) => updateItem(index, "medicationName", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dosage</Label>
                                        <Input
                                            placeholder="e.g. 500mg"
                                            required
                                            value={item.dosage}
                                            onChange={(e) => updateItem(index, "dosage", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Frequency</Label>
                                        <Input
                                            placeholder="e.g. Twice daily"
                                            required
                                            value={item.frequency}
                                            onChange={(e) => updateItem(index, "frequency", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Duration</Label>
                                        <Input
                                            placeholder="e.g. 7 days"
                                            value={item.duration || ""}
                                            onChange={(e) => updateItem(index, "duration", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label>Instructions</Label>
                                        <Input
                                            placeholder="e.g. Post-meal"
                                            value={item.instructions || ""}
                                            onChange={(e) => updateItem(index, "instructions", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" className="w-full gap-2" onClick={addItem}>
                            <Plus className="h-4 w-4" /> Add Medication
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>General Notes</Label>
                        <Input
                            placeholder="Additional notes for the pharmacist..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Issuing..." : "Issue Prescription"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}
