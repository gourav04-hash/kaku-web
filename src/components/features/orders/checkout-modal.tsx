"use client"

import { useState } from "react"
import { createOrderFromPrescription } from "@/lib/actions/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart } from "lucide-react"

export const CheckoutModal = ({ prescriptionId, items }: { prescriptionId: string; items: any[] }) => {
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    const handleCheckout = async () => {
        setLoading(true)
        setError("")
        const result = await createOrderFromPrescription(prescriptionId, address)
        if (result.error) {
            setError(result.error)
        } else {
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full gap-2 mt-4">
                    <ShoppingCart className="h-4 w-4" /> Fulfill Prescription
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Confirm your medications and delivery address to create an order.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Medications:</h4>
                        <ul className="text-sm space-y-1">
                            {items.map((item, i) => (
                                <li key={i} className="flex justify-between items-center text-muted-foreground p-2 bg-muted rounded">
                                    <span>{item.medicationName}</span>
                                    <span>{item.dosage}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address</Label>
                        <Input
                            id="address"
                            placeholder="Enter your full address..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCheckout} disabled={loading || !address}>
                        {loading ? "Ordering..." : "Confirm Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
