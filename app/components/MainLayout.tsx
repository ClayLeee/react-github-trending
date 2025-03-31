"use client"

import { useState, useEffect } from "react"
import { Menu, PanelLeftClose, PanelLeftOpen, Settings, Loader2, Calendar, CalendarRange, CalendarClock, Languages, Database, LayoutDashboard, RefreshCw, RotateCw, Code } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/app/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import Link from "next/link"
import { useToast } from "@/app/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [systemActionLoading, setSystemActionLoading] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [taskStatus, setTaskStatus] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // 檢測是否為移動裝置
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile() // 初始檢查
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 在移動設備上點擊背景時自動關閉 sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  // 檢查任務狀態
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (systemActionLoading) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/scraper/status')
          if (!response.ok) throw new Error('Failed to fetch status')

          const data = await response.json()
          setTaskStatus(data.status)

          if (data.status === 'completed' || data.status === 'failed') {
            if (interval) clearInterval(interval)
            setSystemActionLoading(null)
            setTaskStatus(null)

            // 顯示完成提示
            toast({
              title: data.status === 'completed' ? '任務完成' : '任務失敗',
              description: data.message,
              variant: data.status === 'completed' ? 'default' : 'destructive',
            })

            // 如果當前在爬蟲記錄頁面，則刷新
            if (window.location.pathname === '/scraper-logs') {
              router.refresh()
            }
          }
        } catch (error) {
          console.error('檢查任務狀態失敗:', error)
          if (interval) clearInterval(interval)
          setSystemActionLoading(null)
          setTaskStatus(null)
        }
      }, 2000) // 每2秒檢查一次
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [systemActionLoading, router, toast])

  // 執行系統操作的函數
  const executeSystemAction = async (action: 'daily' | 'weekly' | 'monthly' | 'languages' | 'comprehensive') => {
    setSystemActionLoading(action)
    setTaskStatus('starting')

    try {
      const response = await fetch('/api/scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // 顯示開始執行的提示
      toast({
        title: '任務已開始執行',
        description: getTaskDescription(action),
      })
    } catch (error) {
      setSystemActionLoading(null)
      setTaskStatus(null)
      toast({
        title: '系統操作失敗',
        description: `執行 ${action} 操作時發生錯誤`,
        variant: 'destructive',
      })
      console.error(`執行系統操作 ${action} 失敗:`, error)
    }
  }

  // 根據任務類型獲取描述
  const getTaskDescription = (action: string) => {
    switch (action) {
      case 'comprehensive':
        return '正在執行完整趨勢爬取，包括一般趨勢和各語言趨勢...';
      case 'languages':
        return '正在執行各程式語言趨勢爬取，請稍候...';
      case 'daily':
        return '正在執行每日趨勢爬取，請稍候...';
      case 'weekly':
        return '正在執行每週趨勢爬取，請稍候...';
      case 'monthly':
        return '正在執行每月趨勢爬取，請稍候...';
      default:
        return '正在執行爬蟲任務，請稍候...';
    }
  }

  // 處理 sidebar 縮放或開關
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#e6faf9] dark:bg-[#0f172a]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <div className={cn(
        "flex-1 flex flex-col h-screen overflow-hidden",
        sidebarCollapsed && !isMobile ? "lg:ml-16" : "lg:ml-64"
      )}>
        <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 shadow-sm flex-shrink-0 dark:border-[#1e1b4b]/40 dark:bg-[#0f172a]/95 dark:shadow-[#1e1b4b]/20">
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle sidebar"
                onClick={toggleSidebar}
                className="hover:bg-[#17cfc8]/10 dark:hover:bg-[#4338ca]/30 dark:text-white"
              >
                {isMobile ?
                  <Menu className="h-6 w-6" /> :
                  (sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />)
                }
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={systemActionLoading !== null}
                    aria-label="系統操作"
                    className="relative hover:bg-[#17cfc8]/10 dark:hover:bg-[#4338ca]/30 dark:text-white"
                  >
                    {systemActionLoading ?
                      <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" /> :
                      <Settings className="h-[1.2rem] w-[1.2rem]" />
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/80 backdrop-blur-sm border-[#17cfc8]/30 dark:bg-[#172554] dark:border-[#4338ca]/30">
                  <DropdownMenuLabel className="text-gray-800 dark:text-white">系統操作</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:border-[#4338ca]/30" />
                  <DropdownMenuItem onClick={() => executeSystemAction('comprehensive')} className="hover:bg-[#17cfc8]/10 dark:hover:bg-[#4338ca]/30 dark:text-white dark:focus:bg-[#4338ca]/50 dark:focus:text-white">
                    <Database className="mr-2 h-4 w-4 text-[#17cfc8] dark:text-white" />
                    <span>完整趨勢爬取</span>
                    {systemActionLoading === 'comprehensive' && (
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {taskStatus === 'starting' && '準備中...'}
                          {taskStatus === 'running' && '執行中...'}
                          {taskStatus === 'completed' && '已完成'}
                          {taskStatus === 'failed' && '失敗'}
                        </span>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-[#17cfc8]/10 dark:hover:bg-[#4338ca]/30 dark:text-white dark:focus:bg-[#4338ca]/50 dark:focus:text-white">
                    <Link href="/scraper-logs" className="cursor-pointer flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4 text-[#17cfc8] dark:text-white" />
                      <span>查看爬蟲記錄</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a]/95">
          <div className="p-4 md:p-6 mx-auto container max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
