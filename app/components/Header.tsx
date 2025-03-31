"use client"

import Link from "next/link"
import { Github } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header className="border-b py-4 bg-background dark:bg-slate-900/95 dark:border-slate-800">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl dark:text-slate-100">
          <Github size={24} />
          <span>GitHub Trending 追蹤器</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/daily" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            每日趨勢
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/weekly" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            每週趨勢
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/monthly" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            每月趨勢
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/languages" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            程式語言
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            歷史數據
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            儀表板
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
          <Link href="/monitor" className="text-muted-foreground hover:text-primary transition-colors relative group dark:text-slate-300 dark:hover:text-purple-400">
            系統監控
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary dark:bg-purple-400 group-hover:w-full transition-all"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* 移動設備上的下拉選單 */}
          <div className="md:hidden">
            {/* 待實現移動裝置選單 */}
          </div>
        </div>
      </div>
    </header>
  )
}
