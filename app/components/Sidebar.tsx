"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  Calendar,
  Clock,
  LayoutDashboard,
  Star,
  Code,
  Hash,
  Layers
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { useState, useEffect } from "react"

interface SidebarNavProps {
  isOpen: boolean
  collapsed?: boolean
  onClose?: () => void
}

const navItems = [
  {
    title: '儀表板',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: '每日趨勢',
    href: '/daily',
    icon: Star
  },
  {
    title: '每週趨勢',
    href: '/weekly',
    icon: Calendar
  },
  {
    title: '每月趨勢',
    href: '/monthly',
    icon: Layers
  },
  {
    title: '程式語言趨勢',
    href: '/languages',
    icon: Code
  }
]

export function Sidebar({ isOpen, collapsed = false, onClose }: SidebarNavProps) {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState<string>("")

  // 只在客戶端渲染時更新時間
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('zh-TW'))

    // 可選：每分鐘更新一次時間
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('zh-TW'))
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out dark:bg-[#0f172a] dark:border-[#1e1b4b]/40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-14 lg:h-[60px] items-center justify-between border-b px-4 md:px-6 flex-shrink-0 dark:border-[#1e1b4b]/60">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary overflow-hidden w-full dark:text-white">
              <BarChart2 className="h-6 w-6 flex-shrink-0 text-[#17cfc8] dark:text-[#4338ca]" />
              <span className="truncate transition-opacity duration-200">GitHub Trending</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="flex justify-center w-full">
              <BarChart2 className="h-6 w-6 text-[#17cfc8] dark:text-[#4338ca]" />
            </Link>
          )}
        </div>
        <div className="flex-1 py-4 md:py-6 overflow-y-auto">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 hover:text-accent-foreground transition-colors dark:hover:bg-[#4338ca]/30",
                  pathname === item.href ? "bg-accent text-accent-foreground dark:bg-[#4338ca]/50 dark:text-white" : "text-muted-foreground dark:text-white/70",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", pathname === item.href ? "text-[#17cfc8] dark:text-white" : "text-muted-foreground dark:text-white/70")} />
                {!collapsed && <span className="truncate transition-opacity duration-200">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t flex-shrink-0 dark:border-[#1e1b4b]/60">
          <div className={cn("px-4 md:px-6 py-4", collapsed && "px-2 text-center")}>
            {!collapsed ? (
              <div className="text-xs text-muted-foreground dark:text-white/70">
                <div>資料最後更新時間:</div>
                <div className="font-medium text-foreground dark:text-white truncate">
                  {currentTime}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground dark:text-white/70">
                <Clock className="h-4 w-4 mx-auto mb-1" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
