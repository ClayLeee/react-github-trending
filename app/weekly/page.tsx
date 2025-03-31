"use client"

import { useState, useEffect } from "react"
import { Filter, Calendar } from "lucide-react"
import { MainLayout } from "@/app/components/MainLayout"
import { ClientButton as Button } from "@/app/components/ClientButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import {
  ClientCard as Card,
  ClientCardContent as CardContent,
  ClientCardDescription as CardDescription,
  ClientCardHeader as CardHeader,
  ClientCardTitle as CardTitle
} from "@/app/components/ClientCard"
import { RepositoryTable } from "@/app/components/RepositoryTable"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Repository {
  id: number
  repoId: string
  name: string          // 專案名稱
  owner: string         // 擁有者
  description: string | null // 專案描述
  url: string           // 專案 URL
  language: string | null // 使用的程式語言
  stars: number         // 總星數
  forks: number         // fork 數量
  currentStars: number  // 當前趨勢期間獲得的星數
  trendingDate: string  // 趨勢日期
  isDaily?: boolean     // 是否為每日趨勢
  isWeekly?: boolean    // 是否為每週趨勢
}

export default function WeeklyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const languageParam = searchParams.get('language') || "all"

  const [loading, setLoading] = useState(true)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [error, setError] = useState<string | null>(null)
  const [languages, setLanguages] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageParam)

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true)
      try {
        const searchParams = new URLSearchParams()
        if (selectedLanguage !== "all") {
          searchParams.append("language", selectedLanguage)
        }
        searchParams.append("pageSize", "50")  // 獲取50條數據

        const response = await fetch(`/api/trending/repositories/weekly?${searchParams.toString()}`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setRepositories(data.data || [])

        // 提取所有語言
        const langs = new Set<string>()
        data.data.forEach((repo: Repository) => {
          if (repo.language) {
            langs.add(repo.language)
          }
        })
        setLanguages(Array.from(langs).sort())
      } catch (err) {
        console.error("Failed to fetch weekly repositories:", err)
        setError("載入資料失敗，請稍後再試")
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [selectedLanguage])

  const handleLanguageChange = (value: string) => {
    router.push(`/weekly?language=${value}`)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#17cfc8] dark:text-[#4338ca]" />
          <div className="text-lg text-gray-800 dark:text-white">載入數據中...</div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">每週趨勢</h1>
            <p className="text-destructive">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-[#17cfc8] hover:bg-[#17cfc8]/90 dark:bg-[#4338ca] dark:hover:bg-[#4338ca]/90">重新嘗試</Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="main-content">
        <div className="page-header">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
                <Calendar className="h-6 w-6 text-[#17cfc8] dark:text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">每週趨勢</h1>
            </div>
            <p className="text-muted-foreground dark:text-white/70 font-light tracking-wide">
              探索 GitHub 上最近一週內新增星星數最多的開源專案
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#17cfc8] dark:text-white/70" />
              <span className="text-sm text-gray-600 dark:text-white/70">語言:</span>
            </div>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] border-[#17cfc8]/30 dark:border-[#4338ca]/30 dark:bg-[#1e1b4b] dark:text-white">
                <SelectValue placeholder="選擇語言" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1e1b4b] dark:border-[#4338ca]/30">
                <SelectItem value="all" className="dark:text-white dark:focus:bg-[#4338ca]/30">所有語言</SelectItem>
                {languages.map((lang: string) => (
                  <SelectItem key={lang} value={lang} className="dark:text-white dark:focus:bg-[#4338ca]/30">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/languages" className="text-sm text-[#17cfc8] hover:text-[#17cfc8]/70 dark:text-white dark:hover:text-white/70 transition-colors">
              查看全部語言
            </Link>
          </div>
        </div>

        <div className="responsive-grid">
          <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">總專案數</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#17cfc8] dark:text-white"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">{repositories.length}</div>
              <p className="text-xs text-gray-600 dark:text-slate-300/70">
                當前顯示的熱門專案數量
              </p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">總星數</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#17cfc8] dark:text-white"
                >
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">
                {repositories.reduce((sum: number, repo: Repository) => sum + repo.stars, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300/70">
                所有顯示專案的總星標數
              </p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">本週新增星數</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#17cfc8] dark:text-white"
                >
                  <path d="M16 16v-4a4 4 0 0 0-8 0v4" />
                  <path d="M20 16H4" />
                  <path d="M4 20V11a7 7 0 0 1 16 0v9" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">
                {repositories.reduce((sum: number, repo: Repository) => sum + repo.currentStars, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300/70">
                過去一週內的新增星標數
              </p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">平均星數</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#17cfc8] dark:text-white"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">
                {repositories.length > 0
                  ? Math.round(
                    repositories.reduce((sum: number, repo: Repository) => sum + repo.stars, 0) /
                    repositories.length
                  ).toLocaleString()
                  : 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300/70">
                所有專案的平均星標數
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-[#f0fdf4] dark:bg-[#312e81] shadow dark:shadow-xl rounded-lg overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">每週熱門專案</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 transition-colors dark:bg-[#4338ca]/30">
                <Calendar className="h-4 w-4 text-[#17cfc8] dark:text-white" />
              </div>
            </div>
            <CardDescription className="text-gray-600 dark:text-white/70">
              以本週新增星星數排序，顯示 GitHub 上最近一週內獲得最多星標的開源專案
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RepositoryTable repositories={repositories} timeRange="weekly" />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
