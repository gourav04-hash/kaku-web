import { getOrders } from "@/lib/actions/order"
import { OrderList } from "@/components/features/orders/order-list"

export default async function PatientOrdersPage() {
    const result = await getOrders()
    const orders = result.success ? result.orders : []

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground">
                    Track your medication orders and delivery status.
                </p>
            </div>

            <OrderList orders={orders} />
        </main>
    )
}
