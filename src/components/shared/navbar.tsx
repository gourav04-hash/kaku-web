"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Pill,
    LayoutDashboard,
    FileText,
    Package,
    LogOut,
    UserCircle,
    Bell,
    Shield
} from "lucide-react"

import { NotificationCenter } from "./notification-center"


export function Navbar() {
    const { data: session } = useSession()
    const user = session?.user as any

    if (!session) return null

    const links = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ...(user.role === "ADMIN" ? [
            { label: "Admin Console", href: "/admin/dashboard", icon: Shield },
        ] : []),
        ...(user.role === "PATIENT" ? [
            { label: "Doctors", href: "/patient/doctors", icon: UserCircle },
            { label: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
            { label: "Lab Results", href: "/patient/lab-results", icon: FileText },
            { label: "My Orders", href: "/patient/orders", icon: Package },
            { label: "Privacy", href: "/patient/privacy", icon: Shield },
        ] : []),
        ...(user.role === "PHARMACIST" ? [
            { label: "Incoming Orders", href: "/pharmacist/dashboard", icon: Package },
        ] : []),
    ]


    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="bg-primary p-1.5 rounded-xl">
                            <Pill className="h-5 w-5 text-white" />
                        </div>
                        <span>Kaku Pharmacy</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Button key={link.href} variant="ghost" className="gap-2" asChild>
                                <Link href={link.href}>
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-sm font-bold">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black">{user.role}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
