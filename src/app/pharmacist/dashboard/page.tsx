import { getOrders } from "@/lib/actions/order"
import { OrderList } from "@/components/features/orders/order-list"

export default async function PharmacistDashboard() {
    const result = await getOrders()
    const orders = result.success ? result.orders : []

    return (
        <main className="p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Pharmacist Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage and process medication orders.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Incoming Orders</h2>
                    <OrderList orders={orders} isPharmacist={true} />
                </section>
            </div>
        </main>
    )
}
