import { getPrescriptions } from "@/lib/actions/prescription"
import { PrescriptionCard } from "@/components/features/prescriptions/prescription-card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function PatientPrescriptionsPage() {
    const session = await getServerSession(authOptions)
    const result = await getPrescriptions()
    const prescriptions = result.success ? result.prescriptions : []

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">My Prescriptions</h1>
                <p className="text-muted-foreground">
                    View and manage your digital prescriptions issued by your doctors.
                </p>
            </div>

            {prescriptions.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    You don't have any prescriptions yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prescriptions.map((px: any) => (
                        <PrescriptionCard key={px.id} prescription={px} role={(session?.user as any)?.role} />
                    ))}
                </div>
            )}
        </main>
    )
}
