import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuditTrailView } from "@/components/features/privacy/audit-trail"

export default async function PrivacyPage() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "PATIENT") redirect("/login")

    const user = session.user as any

    return (
        <main className="p-8 max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight leading-none">Privacy & <span className="text-primary">Transparency</span>.</h1>
                <p className="text-muted-foreground text-lg mt-2 font-medium">Manage your data consent and view your medical access history.</p>
            </div>

            <AuditTrailView userId={(session.user as any).id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border-2 rounded-[2.5rem] space-y-4">
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary"><Shield className="h-6 w-6" /></div>
                    <h3 className="text-xl font-black">Data Encryption</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Your medical records are encrypted with AES-256 and stored in compliant, private buckets. Only verified clinicians with your active consent can view them.
                    </p>
                </div>
                <div className="p-8 border-2 rounded-[2.5rem] space-y-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl w-fit text-amber-600"><Eye className="h-6 w-6" /></div>
                    <h3 className="text-xl font-black">Consent Control</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Currently, 2 doctors have access to your profile. You can revoke access at any time through the Doctor Selection portal.
                    </p>
                </div>
            </div>
        </main>
    )
}

function Shield({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> }
function Eye({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> }
