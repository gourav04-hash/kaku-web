"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Paperclip, X } from "lucide-react"

interface UploadProps {
    onUploadSuccess: (fileData: { url: string; name: string; fileType: string }) => void
}

export const DocumentUpload = ({ onUploadSuccess }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
            setError("")
        }
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setError("")

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (data.success) {
                onUploadSuccess(data)
                setFile(null)
            } else {
                setError(data.error || "Upload failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4 p-4 border rounded-md">
            <Label className="text-sm font-semibold">Attach Document</Label>
            {!file ? (
                <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors relative">
                    <Input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs">Click or drag to upload report/prescription</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between p-2 bg-muted rounded-md border">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="h-4 w-4 shrink-0" />
                        <span className="text-xs truncate">{file.name}</span>
                    </div>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFile(null)}>
                            <X className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={handleUpload} disabled={uploading} className="h-7 text-[10px] px-2">
                            {uploading ? "..." : "Upload"}
                        </Button>
                    </div>
                </div>
            )}
            {error && <p className="text-[10px] text-destructive">{error}</p>}
        </div>
    )
}
