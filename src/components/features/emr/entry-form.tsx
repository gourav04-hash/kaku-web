"use client"

import { useState } from "react"
import { addMedicalEntry } from "@/lib/actions/emr"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentUpload } from "./document-upload"

export const MedicalEntryForm = ({ patientId }: { patientId: string }) => {
    const [content, setContent] = useState("")
    const [type, setType] = useState("NOTE")
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const result = await addMedicalEntry(patientId, content, type, documents)

        if (result.error) {
            setError(result.error)
        } else {
            setContent("")
            setDocuments([])
        }
        setLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Medical Entry</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Entry Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NOTE">Consultation Note</SelectItem>
                                <SelectItem value="DIAGNOSIS">Diagnosis Entry</SelectItem>
                                <SelectItem value="LAB_RESULT">Lab Result Summary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Medical Notes</Label>
                        <Textarea
                            id="content"
                            placeholder="Enter clinical notes, symptoms, or findings..."
                            className="min-h-[150px]"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <DocumentUpload onUploadSuccess={(data) => setDocuments([...documents, data])} />
                    {documents.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {documents.map((doc, i) => (
                                <div key={i} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded flex items-center gap-1">
                                    {doc.name}
                                </div>
                            ))}
                        </div>
                    )}
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Entry"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}
