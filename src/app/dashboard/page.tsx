import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPatientHistory } from "@/lib/actions/emr"
import { getPrescriptions } from "@/lib/actions/prescription"
import { getOrders } from "@/lib/actions/order"
import { getAppointments } from "@/lib/actions/appointment"
import { getLabReports } from "@/lib/actions/lab"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    LayoutDashboard,
    FileText,
    Pill,
    Package,
    Users,
    Activity,
    Video,
    Calendar,
    FlaskConical,
    TrendingUp,
    ArrowRight
} from "lucide-react"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const user = session.user as any
    const role = user.role

    return (
        <main className="p-8 max-w-[1600px] mx-auto space-y-12 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tight leading-none">Healthy Day, <span className="text-primary">{user.name.split(' ')[0]}</span>.</h1>
                    <p className="text-muted-foreground text-lg mt-3 font-medium">Your healthcare command center is ready.</p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
                    <div className="px-4 py-2 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                        {role}
                    </div>
                    <div className="px-4 py-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                        Verified Account
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {role === "PATIENT" && <PatientStats userId={user.id} />}
                {role === "DOCTOR" && <DoctorStats userId={user.id} />}
                {role === "PHARMACIST" && <PharmacistStats />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Calendar className="h-5 w-5" /></div>
                                Upcoming Appointments
                            </h2>
                            <Button variant="link" className="font-bold text-primary" asChild>
                                <Link href={role === "PATIENT" ? "/patient/doctors" : "#"}>View All</Link>
                            </Button>
                        </div>
                        <RecentAppointments userId={user.id} role={role} />
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Activity className="h-5 w-5" /></div>
                                Recent Medical History
                            </h2>
                        </div>
                        {role === "PATIENT" && <PatientRecentActivity userId={user.id} />}
                        {role === "DOCTOR" && <DoctorRecentActivity userId={user.id} />}
                        {role === "PHARMACIST" && <PharmacistRecentActivity />}
                    </section>
                </div>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-black tracking-tight mb-6">Quick Actions</h2>
                        <QuickActions role={role} />
                    </section>

                    {role === "PATIENT" && (
                        <section className="bg-zinc-950 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
                            <div className="relative z-10 space-y-6">
                                <div className="p-3 bg-white/10 rounded-2xl w-fit backdrop-blur-md">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-3xl font-black leading-tight">Your health is our priority.</h3>
                                <p className="text-zinc-400 font-medium">Keep your medical profile updated for better consultation results.</p>
                                <Button className="w-full h-14 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 transition-colors border-none">
                                    Complete Profile
                                </Button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    )
}

async function PatientStats({ userId }: { userId: string }) {
    const patient = await (prisma as any).patientProfile.findUnique({ where: { userId } })
    if (!patient) return null

    const stats = [
        { label: "Active PX", value: await (prisma as any).prescription.count({ where: { patientId: patient.id, status: "ACTIVE" } }), icon: Pill },
        { label: "Lab Reports", value: await (prisma as any).labReport.count({ where: { patientId: patient.id } }), icon: FlaskConical },
        { label: "EMR Entries", value: await (prisma as any).medicalRecordEntry.count({ where: { patientId: patient.id } }), icon: FileText },
        { label: "Appointments", value: await (prisma as any).appointment.count({ where: { patientId: patient.id, status: "SCHEDULED" } }), icon: Calendar },
    ]

    return <StatsGrid stats={stats} />
}

async function DoctorStats({ userId }: { userId: string }) {
    const doctor = await (prisma as any).doctorProfile.findUnique({ where: { userId } })
    if (!doctor) return null

    const stats = [
        { label: "Patients", value: await (prisma as any).consent.count({ where: { doctorId: doctor.id, status: "ACTIVE" } }), icon: Users },
        { label: "Records Issued", value: await (prisma as any).medicalRecordEntry.count({ where: { doctorId: doctor.id } }), icon: FileText },
        { label: "Prescriptions", value: await (prisma as any).prescription.count({ where: { doctorId: doctor.id } }), icon: Pill },
        { label: "Appointments", value: await (prisma as any).appointment.count({ where: { doctorId: doctor.id, status: "SCHEDULED" } }), icon: Calendar },
    ]

    return <StatsGrid stats={stats} />
}

async function PharmacistStats() {
    const stats = [
        { label: "Pending Orders", value: await (prisma as any).order.count({ where: { status: "PENDING" } }), icon: Package },
        { label: "Processing", value: await (prisma as any).order.count({ where: { status: "PROCESSING" } }), icon: Activity },
        { label: "Fulfilled Today", value: await (prisma as any).order.count({ where: { status: "DELIVERED" } }), icon: Package },
        { label: "Medication", value: await (prisma as any).medication.count(), icon: Pill },
    ]

    return <StatsGrid stats={stats} />
}

function StatsGrid({ stats }: { stats: any[] }) {
    return (
        <>
            {stats.map((stat, i) => (
                <Card key={i} className="rounded-[2.5rem] border-2 hover:border-primary/20 transition-all group overflow-hidden bg-zinc-50/50">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <h3 className="text-4xl font-black tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
                        </div>
                        <div className="p-4 bg-white rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

async function RecentAppointments({ userId, role }: { userId: string, role: string }) {
    const res = await getAppointments(role, userId)
    const appointments = res.success ? res.appointments.slice(0, 2) : []

    if (appointments.length === 0) return <EmptyState label="No upcoming appointments" />

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt: any) => (
                <div key={apt.id} className="p-6 bg-white border-2 rounded-[2rem] flex flex-col gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-xs">
                                {role === "PATIENT" ? apt.doctor.user.name[0] : apt.patient.user.name[0]}
                            </div>
                            <div>
                                <h4 className="font-black text-sm">{role === "PATIENT" ? `Dr. ${apt.doctor.user.name}` : apt.patient.user.name}</h4>
                                <p className="text-[10px] text-zinc-400 font-bold">{new Date(apt.startTime).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                            {apt.type}
                        </Badge>
                    </div>
                    <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest gap-2" asChild>
                        <Link href={`/${role.toLowerCase()}/appointments/${apt.id}/room`}>
                            <Video className="h-3.5 w-3.5" /> Join Session
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    )
}

async function PatientRecentActivity({ userId }: { userId: string }) {
    const patient = await (prisma as any).patientProfile.findUnique({ where: { userId } })
    if (!patient) return <EmptyState />
    const history = await getPatientHistory(patient.id)
    return <RecentList items={history.success ? history.history.slice(0, 3) : []} type="EMR" role="PATIENT" />
}

async function DoctorRecentActivity({ userId }: { userId: string }) {
    const doctor = await (prisma as any).doctorProfile.findUnique({ where: { userId } })
    if (!doctor) return <EmptyState />
    const entries = await (prisma as any).medicalRecordEntry.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 3
    })
    return <RecentList items={entries} type="DOCTOR" role="DOCTOR" />
}

async function PharmacistRecentActivity() {
    const orders = await getOrders()
    return <RecentList items={orders.success ? orders.orders.slice(0, 3) : []} type="ORDER" role="PHARMACIST" />
}

function RecentList({ items, type, role }: { items: any[]; type: string, role: string }) {
    if (items.length === 0) return <EmptyState />

    return (
        <div className="space-y-4">
            {items.map((item: any) => (
                <div key={item.id} className="group flex items-center gap-6 p-6 bg-zinc-50/50 hover:bg-white border hover:border-primary/20 transition-all rounded-[2rem]">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                        {type === "EMR" ? <FileText className="h-6 w-6" /> : type === "ORDER" ? <Package className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-lg">
                            {type === "EMR" ? item.type : type === "ORDER" ? `Order #${item.id.slice(-6).toUpperCase()}` : `Entry for ${item.patient.user.name}`}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-zinc-400 font-bold">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-zinc-300">•</span>
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                                {type === "EMR" ? "Diagnostic" : type === "ORDER" ? item.status : "Medical Record"}
                            </span>
                        </div>
                    </div>
                    <Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary p-0" asChild>
                        <Link href={type === "EMR" ? "#" : type === "ORDER" ? "/pharmacist/dashboard" : `/doctor/patients/${item.patient.userId}/history`}>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    )
}

function EmptyState({ label = "No recent activity found." }: { label?: string }) {
    return (
        <div className="p-16 text-center border-4 border-dashed rounded-[3rem] text-muted-foreground bg-zinc-50/30">
            <p className="font-bold text-lg">{label}</p>
            <p className="text-xs mt-1">New updates will appear here automatically.</p>
        </div>
    )
}

function QuickActions({ role }: { role: string }) {
    const actions: any = {
        PATIENT: [
            { label: "Consult a Specialist", href: "/patient/doctors", icon: Users, color: "bg-blue-500" },
            { label: "View Prescriptions", href: "/patient/prescriptions", icon: Pill, color: "bg-emerald-500" },
            { label: "Order Medications", href: "/patient/orders", icon: Package, color: "bg-amber-500" },
            { label: "Lab Reports", href: "/patient/lab-results", icon: FlaskConical, color: "bg-purple-500" },
        ],
        DOCTOR: [
            { label: "Patient Database", href: "#", icon: Users, color: "bg-blue-500" },
            { label: "Clinical Notes", href: "#", icon: FileText, color: "bg-emerald-500" },
            { label: "Schedule Management", href: "#", icon: Calendar, color: "bg-purple-500" },
        ],
        PHARMACIST: [
            { label: "Order Queue", href: "/pharmacist/dashboard", icon: Package, color: "bg-blue-500" },
            { label: "Inventory Analysis", href: "#", icon: Pill, color: "bg-emerald-500" },
            { label: "Revenue Reports", href: "#", icon: TrendingUp, color: "bg-amber-500" },
        ]
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {actions[role]?.map((action: any, i: number) => (
                <Button key={i} variant="outline" className="w-full justify-start p-8 rounded-[2rem] border-2 hover:border-primary/30 group transition-all" asChild>
                    <Link href={action.href} className="flex items-center gap-6 w-full">
                        <div className={cn("p-4 rounded-2xl text-white shadow-xl shadow-inner transition-transform group-hover:scale-110", action.color)}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-black tracking-tight leading-none mb-1">{action.label}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Access Service</p>
                        </div>
                    </Link>
                </Button>
            ))}
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
