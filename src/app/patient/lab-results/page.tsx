import { getLabReports } from "@/lib/actions/lab"
import { LabReportCard } from "@/components/features/lab/report-card"

export default async function LabResultsPage() {
    const result = await getLabReports()
    const reports = result.success ? result.reports : []

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Diagnostic Reports</h1>
                <p className="text-muted-foreground text-lg">
                    Track and download your laboratory test results as they become available.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reports.length === 0 ? (
                    <div className="col-span-full p-20 text-center border-4 border-dashed rounded-3xl text-muted-foreground bg-muted/5">
                        <p className="text-xl font-medium">No lab reports on file.</p>
                        <p className="text-sm">New results will appear here automatically.</p>
                    </div>
                ) : (
                    reports.map((report: any) => (
                        <LabReportCard key={report.id} report={report} />
                    ))
                )}
            </div>
        </main>
    )
}
