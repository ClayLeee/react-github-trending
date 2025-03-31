"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { MainLayout } from "@/app/components/MainLayout"
import { Loader2, Search, Code, ArrowUpRight } from "lucide-react"
import { ClientButton as Button } from "@/app/components/ClientButton"
import { ClientInput as Input } from "@/app/components/ClientInput"
import Link from "next/link"
import { fetchLanguages } from "@/app/lib/api"
import {
  PROGRAMMING_LANGUAGES,
  LANGUAGE_COLORS,
  LANGUAGE_URL_MAP,
  LANGUAGE_DISPLAY_MAP
} from "@/app/lib/constants"
import {
  ClientCard as Card,
  ClientCardContent as CardContent,
  ClientCardDescription as CardDescription,
  ClientCardHeader as CardHeader,
  ClientCardTitle as CardTitle
} from "@/app/components/ClientCard"

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // 嘗試從 API 獲取語言列表
        const langData = await fetchLanguages()
        // 如果 API 返回空列表，使用常量中定義的列表
        setLanguages(langData && langData.length > 0 ? langData : PROGRAMMING_LANGUAGES)
        setError(null)
      } catch (err) {
        console.error("Error fetching languages:", err)
        // 如果 API 失敗，使用常量中定義的列表作為後備
        setLanguages(PROGRAMMING_LANGUAGES)
        setError("無法從 API 獲取語言列表，顯示預設語言")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 過濾語言
  const filteredLanguages = searchTerm
    ? languages.filter(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (LANGUAGE_DISPLAY_MAP[lang.toLowerCase()] &&
         LANGUAGE_DISPLAY_MAP[lang.toLowerCase()].toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : languages

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#17cfc8] dark:text-[#4338ca]" />
          <div className="text-lg text-gray-800 dark:text-white">載入語言列表中...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="main-content">
        {/* 頁面標題區域 */}
        <div className="page-header">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
                <Code className="h-6 w-6 text-[#17cfc8] dark:text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">程式語言列表</h1>
            </div>
            <p className="text-muted-foreground dark:text-white/70 font-light tracking-wide">
              瀏覽 GitHub 上各種程式語言的熱門趨勢專案
            </p>
            {error && <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="搜尋語言..."
                className="pl-10 bg-white/50 backdrop-blur-sm border-[#17cfc8]/30 dark:border-[#4338ca]/30 dark:bg-[#1e1b4b] dark:text-white w-full"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#17cfc8] dark:text-white/70" />
            </div>
          </div>
        </div>

        {/* 語言卡片列表 */}
        <Card className="mt-6 bg-[#f0fdf4] dark:bg-[#312e81] shadow dark:shadow-xl rounded-lg overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">所有語言</CardTitle>
              <div className="p-1.5 rounded-full bg-white/50 transition-colors dark:bg-[#4338ca]/30">
                <Code className="h-4 w-4 text-[#17cfc8] dark:text-white" />
              </div>
            </div>
            <CardDescription className="text-gray-600 dark:text-white/70">
              支援的所有程式語言列表，點擊查看相應語言的熱門趨勢專案
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredLanguages.map((lang) => {
                  // 將語言名稱轉為小寫以進行映射
                  const langLower = lang.toLowerCase();

                  // 處理 C# 的特殊情況
                  const langKey = langLower === 'csharp' ? 'c#' : langLower;

                  // 處理 URL 編碼形式的 C#
                  const langForDisplay = langKey === 'c%23' ? 'c#' : langKey;

                  // 使用常量檔中定義的語言顏色
                  const colorSet = LANGUAGE_COLORS[langForDisplay] ||
                    { bg: 'bg-slate-50', darkBg: 'dark:bg-slate-900/20', border: 'border-slate-300/30' };

                  // 處理URL構建，使用映射表獲取URL安全的語言名稱
                  const urlSafeLang = LANGUAGE_URL_MAP[langForDisplay] || lang;

                  // 使用映射獲取顯示名稱
                  const displayLang = LANGUAGE_DISPLAY_MAP[langForDisplay] || lang;

                  return (
                    <Link
                      key={lang}
                      href={`/languages/${urlSafeLang}?timeRange=monthly`}
                      className={`group p-5 rounded-lg ${colorSet.bg} ${colorSet.darkBg} border ${colorSet.border} shadow-sm hover:shadow-md transition-all hover:scale-[1.02] dark:hover:brightness-110 dark:border-opacity-10 relative overflow-hidden flex flex-col justify-between h-24`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-lg text-gray-800 dark:text-white">{displayLang}</div>
                        <ArrowUpRight className="h-4 w-4 text-[#17cfc8] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">查看趨勢專案</div>
                      <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-black/5 dark:bg-white/5"></div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0f172a] rounded-lg border shadow-sm">
                <div className="mb-4 p-4 rounded-full bg-[#17cfc8]/10 dark:bg-[#4338ca]/20">
                  <Search className="h-10 w-10 text-[#17cfc8] dark:text-[#4338ca]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {searchTerm ? "沒有找到匹配的語言" : "目前沒有可用的語言資料"}
                </h3>
                <p className="text-center text-muted-foreground dark:text-white/70 max-w-md mb-6">
                  {searchTerm
                    ? `沒有找到與 "${searchTerm}" 相符的程式語言，請嘗試其他關鍵字。`
                    : "我們目前無法獲取語言列表資料，請稍後再試。"}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-[#17cfc8] hover:bg-[#17cfc8]/90 dark:bg-[#4338ca] dark:hover:bg-[#4338ca]/90"
                  >
                    清除搜尋
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
