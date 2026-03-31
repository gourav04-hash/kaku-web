import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, DollarSign } from "lucide-react"

interface OrderListProps {
    orders: any[]
    isPharmacist?: boolean
}

export const OrderList = ({ orders, isPharmacist }: OrderListProps) => {
    const statusColors: any = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        SHIPPED: "bg-purple-100 text-purple-700",
        DELIVERED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    }

    if (orders.length === 0) {
        return (
            <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No orders found.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                <span className="font-bold">Order #{order.id.slice(-6).toUpperCase()}</span>
                            </div>
                            <Badge className={statusColors[order.status] || ""}>
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {order.deliveryAddr}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-foreground">
                                <DollarSign className="h-3 w-3" /> {order.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 px-0">
                        <div className="px-6 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</h4>
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.medName}</span>
                                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-mono">${item.priceAtOrder.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-muted/10 mt-4 flex justify-between items-center border-t text-[10px] text-muted-foreground">
                            <span>Placed on: {format(new Date(order.createdAt), "PPP")}</span>
                            {isPharmacist && (
                                <span className="font-medium text-primary">Patient: {order.patient.user.name}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
