import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Pill, Calendar, Activity, TrendingUp, Package, Shield, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") redirect("/login")

    const stats = [
        { label: "Total Users", value: await prisma.user.count(), icon: Users, color: "text-blue-600" },
        { label: "Consultations", value: await prisma.appointment.count(), icon: Calendar, color: "text-purple-600" },
        { label: "Active Orders", value: await prisma.order.count({ where: { status: "PENDING" } }), icon: Package, color: "text-amber-600" },
        { label: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-600" },
    ]

    const recentLogs = await (prisma as any).auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, role: true } } }
    })

    return (
        <main className="p-8 max-w-[1600px] mx-auto space-y-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">System Administration</h1>
                    <p className="text-muted-foreground font-medium mt-1">Platform-wide overview and security compliance.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl font-bold">Export Compliance Report</Button>
                    <Button className="rounded-xl font-bold bg-primary text-white">System Maintenance</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="rounded-[2rem] border-2 bg-zinc-50/50">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-4 bg-white rounded-2xl shadow-sm ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-2">
                    <CardHeader className="p-8 border-b">
                        <CardTitle className="text-xl font-black flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            Security Audit Trail
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {recentLogs.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">No recent audit logs.</div>
                            ) : (
                                recentLogs.map((log: any) => (
                                    <div key={log.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                                                {log.user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{log.user.name} <span className="text-[10px] text-zinc-400 uppercase ml-2">{log.user.role}</span></p>
                                                <p className="text-[11px] text-zinc-500">{log.action}: {log.details}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                            <p className="text-[10px] font-medium text-zinc-400">{new Date(log.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <section className="bg-zinc-950 p-8 rounded-[2.5rem] text-white">
                        <TrendingUp className="h-8 w-8 text-primary mb-6" />
                        <h3 className="text-2xl font-black mb-2">Inventory Health</h3>
                        <p className="text-zinc-400 text-sm font-medium mb-6">92% of essential medications are in stock across all branches.</p>
                        <Button className="w-full h-12 bg-white text-black font-bold rounded-xl border-none">Manage Inventory</Button>
                    </section>

                    <Card className="rounded-[2rem] border-2">
                        <CardHeader className="p-6 border-b">
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Platform Links</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <Button variant="ghost" className="w-full justify-between h-12 rounded-xl text-sm font-bold" asChild>
                                <Link href="/dashboard">View My Dashboard <ExternalLink className="h-4 w-4" /></Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-between h-12 rounded-xl text-sm font-bold" asChild>
                                <Link href="/admin/users">User Directory <ExternalLink className="h-4 w-4" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
