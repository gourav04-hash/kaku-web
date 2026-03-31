import { getPatientHistory, getPatientProfileByUserId } from "@/lib/actions/emr"
import { MedicalTimeline } from "@/components/features/emr/timeline"
import { MedicalEntryForm } from "@/components/features/emr/entry-form"
import { PrescriptionForm } from "@/components/features/prescriptions/prescription-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

export default async function PatientHistoryPage({ params }: { params: { id: string } }) {
    const patientProfile = await getPatientProfileByUserId(params.id)

    if (!patientProfile) {
        notFound()
    }

    const result = await getPatientHistory(patientProfile.id)
    const history = result.success ? result.history : []

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Patient Medical History</h1>
                <p className="text-muted-foreground">
                    Patient: {patientProfile.user.name} ({patientProfile.user.email})
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Tabs defaultValue="note">
                        <TabsList className="w-full">
                            <TabsTrigger value="note" className="flex-1">Clinical Note</TabsTrigger>
                            <TabsTrigger value="rx" className="flex-1">Prescription</TabsTrigger>
                        </TabsList>
                        <TabsContent value="note" className="mt-4">
                            <MedicalEntryForm patientId={patientProfile.id} />
                        </TabsContent>
                        <TabsContent value="rx" className="mt-4">
                            <PrescriptionForm patientId={patientProfile.id} />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold">Timeline</h2>
                    <MedicalTimeline history={history} />
                </div>
            </div>
        </main>
    )
}
