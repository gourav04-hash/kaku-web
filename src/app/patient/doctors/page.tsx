import { getDoctors } from "@/lib/actions/appointment"
import { DoctorCard } from "@/components/features/appointments/doctor-card"

export default async function FindDoctorPage() {
    const result = await getDoctors()
    const doctors = result.success ? result.doctors : []

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Find a Specialist</h1>
                <p className="text-muted-foreground text-lg">
                    Connect with our network of certified physicians for expert medical guidance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.length === 0 ? (
                    <div className="col-span-full p-20 text-center border-4 border-dashed rounded-3xl text-muted-foreground bg-muted/5">
                        <p className="text-xl font-medium">No doctors are currently available.</p>
                        <p className="text-sm">Please check back later.</p>
                    </div>
                ) : (
                    doctors.map((doctor: any) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))
                )}
            </div>
        </main>
    )
}
