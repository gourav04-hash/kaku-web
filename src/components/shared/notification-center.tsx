"use client"

import { useState, useEffect } from "react"
import { Bell, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getNotifications, markAsRead } from "@/lib/actions/system"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([])
    const unreadCount = notifications.filter(n => !n.read).length

    const fetchNotifications = async () => {
        const res = await getNotifications()
        if (res.success) setNotifications(res.notifications)
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const handleMarkRead = async (id: string) => {
        const res = await markAsRead(id)
        if (res.success) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-2 overflow-hidden" align="end">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest">Notifications</h3>
                    <Badge variant="outline" className="text-[10px] font-bold">{unreadCount} New</Badge>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground italic text-sm">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 border-b last:border-0 hover:bg-muted/20 transition-colors flex gap-4 ${!n.read ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex-1 space-y-1">
                                    <p className={`text-sm ${!n.read ? 'font-black' : 'font-medium'}`}>{n.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[10px] text-muted-foreground font-bold">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                        <div className="flex gap-2">
                                            {n.link && (
                                                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                                    <Link href={n.link}>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {!n.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-primary"
                                                    onClick={() => handleMarkRead(n.id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
