"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/app/components/MainLayout"
import { Loader2, Star, ChevronDown, ArrowLeft, ExternalLink, GitFork, Users, Server, TrendingUp } from "lucide-react"
import { ClientButton as Button } from "@/app/components/ClientButton"
import { fetchLanguageTrendingRepositories } from "@/app/lib/api"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ClientCard as Card,
  ClientCardContent as CardContent,
  ClientCardDescription as CardDescription,
  ClientCardHeader as CardHeader,
  ClientCardTitle as CardTitle,
} from "@/app/components/ClientCard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { LANGUAGE_DISPLAY_MAP } from "@/app/lib/constants"

interface Repository {
  id: number
  repoId: string
  name: string
  owner: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
  currentStars: number
  trendingDate: string | Date
}

export default function LanguagePage({ params }: { params: { language: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const timeRange = searchParams.get("timeRange") || "daily"
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 處理 C# 的特殊顯示情況
  let langForDisplay = params.language.toLowerCase();
  if (langForDisplay === 'c%23' || langForDisplay === 'csharp') {
    langForDisplay = 'c#';
  }
  // 處理 C++ 的特殊顯示情況
  if (langForDisplay === 'c%2b%2b') {
    langForDisplay = 'c++';
  }

  // 從映射中獲取顯示名稱，如果沒有則使用原始名稱
  const displayLanguage = LANGUAGE_DISPLAY_MAP[langForDisplay] || langForDisplay;

  // 獲取時間範圍標籤
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "daily":
        return "日";
      case "weekly":
        return "週";
      case "monthly":
        return "月";
      default:
        return "日";
    }
  };

  // 時間範圍選項
  const timeRangeOptions = [
    { value: "daily", label: "每日趨勢" },
    { value: "weekly", label: "每週趨勢" },
    { value: "monthly", label: "月度趨勢" },
  ];

  const fetchTrendingData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchLanguageTrendingRepositories(params.language, timeRange as 'daily' | 'weekly' | 'monthly')
      setRepositories(response)
    } catch (err) {
      console.error("Error fetching trending repositories:", err)
      setError("無法獲取趨勢資料。請稍後再試。")
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加載
  useEffect(() => {
    fetchTrendingData()
  }, [params.language, timeRange])

  // 更改時間範圍
  const handleTimeRangeChange = (value: string) => {
    if (value !== timeRange) {
      router.push(`/languages/${params.language}?timeRange=${value}`)
    }
  }

  // 重試加載
  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await fetchTrendingData()
    } finally {
      setIsRetrying(false)
    }
  }

  const getStarGainPercentage = (currentStars: number, totalStars: number) => {
    if (totalStars === 0) return 0;
    return Math.round((currentStars / totalStars) * 100);
  };

  // 計算統計數據
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalCurrentStars = repositories.reduce((sum, repo) => sum + repo.currentStars, 0);
  const averageStars = repositories.length > 0 ? Math.round(totalStars / repositories.length) : 0;
  const uniqueOwners = new Set(repositories.map(repo => repo.owner)).size;

  return (
    <MainLayout>
      <div className="main-content">
        {/* 頁面標題區域 */}
        <div className="page-header">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/languages')}
                className="h-8 w-8 rounded-full bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30 hover:bg-[#17cfc8]/10"
                title="返回語言列表"
              >
                <ArrowLeft className="h-4 w-4 text-[#17cfc8] dark:text-white" />
              </Button>
              <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
                <Star className="h-6 w-6 text-[#17cfc8] dark:text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">{displayLanguage} 趨勢專案</h1>
            </div>
            <p className="text-muted-foreground dark:text-white/70 font-light tracking-wide">
              探索 GitHub 上 {displayLanguage} 最受歡迎的{getTimeRangeLabel()}度趨勢專案
            </p>
            {error && <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
                onClick={() => document.getElementById('timeRangeDropdown')?.classList.toggle('hidden')}
              >
                {timeRangeOptions.find((option) => option.value === timeRange)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div
                id="timeRangeDropdown"
                className="hidden absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#1e1b4b] rounded-md shadow-lg border border-gray-200 dark:border-[#4338ca]/30 py-1 z-50"
              >
                {timeRangeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-2 text-sm hover:bg-[#17cfc8]/10 dark:hover:bg-[#4338ca]/30 cursor-pointer ${
                      timeRange === option.value ? 'bg-[#17cfc8]/10 dark:bg-[#4338ca]/30 font-medium' : ''
                    } text-gray-800 dark:text-white`}
                    onClick={() => {
                      handleTimeRangeChange(option.value);
                      document.getElementById('timeRangeDropdown')?.classList.add('hidden');
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#17cfc8] dark:text-[#4338ca]" />
            <div className="text-lg text-gray-800 dark:text-white">載入 {displayLanguage} 趨勢專案中...</div>
          </div>
        ) : repositories.length > 0 ? (
          <>
            {/* 趨勢統計資訊卡片 */}
            <div className="responsive-grid">
              <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">趨勢專案數</CardTitle>
                  <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                    <Server className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">{repositories.length}</div>
                  <p className="text-xs text-gray-600 dark:text-slate-300/70">
                    {displayLanguage} {getTimeRangeLabel()}度趨勢專案總數
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">{getTimeRangeLabel()}增星數</CardTitle>
                  <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                    <TrendingUp className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">{totalCurrentStars.toLocaleString()}</div>
                  <p className="text-xs text-gray-600 dark:text-slate-300/70">
                    專案在{getTimeRangeLabel()}內新增的總星星數
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">總星數</CardTitle>
                  <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                    <Star className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">{totalStars.toLocaleString()}</div>
                  <p className="text-xs text-gray-600 dark:text-slate-300/70">
                    所有趨勢專案的總星星數
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] bg-[#f0fdf4] dark:bg-[#312e81] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">活躍開發者</CardTitle>
                  <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                    <Users className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#17cfc8] dark:text-white">{uniqueOwners}</div>
                  <p className="text-xs text-gray-600 dark:text-slate-300/70">
                    趨勢專案的不重複開發者數量
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 專案卡片列表 */}
            <Card className="mt-6 bg-[#f0fdf4] dark:bg-[#312e81] shadow dark:shadow-xl rounded-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">{displayLanguage} 熱門項目</CardTitle>
                  <div className="p-1.5 rounded-full bg-white/50 transition-colors dark:bg-[#4338ca]/30">
                    <Star className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-white/70">
                  以{getTimeRangeLabel()}期增加星數排序，顯示 GitHub 上 {displayLanguage} 語言{getTimeRangeLabel()}度最熱門的開源專案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {repositories.map((repo) => {
                    const starGainPercent = getStarGainPercentage(repo.currentStars, repo.stars);

                    return (
                      <Card
                        key={repo.id}
                        className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.01] bg-white dark:bg-[#0f172a] overflow-hidden relative border-gray-200 dark:border-gray-800 flex flex-col h-full"
                      >
                        {/* 背景裝飾元素 */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#17cfc8]/10 dark:from-[#4338ca]/20 to-transparent rounded-bl-full pointer-events-none"></div>

                        <CardHeader className="pb-3 flex-shrink-0">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-grow min-w-0 flex flex-col">
                                <Link
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group-hover:underline"
                                >
                                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-normal">
                                    <span className="truncate max-w-[200px]">{repo.owner}</span>
                                    <span className="mx-1">/</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-bold text-gray-800 dark:text-white hover:text-[#17cfc8] dark:hover:text-[#4338ca] transition-colors truncate">{repo.name}</span>
                                    <ExternalLink className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#17cfc8] dark:text-[#4338ca] flex-shrink-0" />
                                  </div>
                                </Link>
                              </div>
                              <div className="flex items-center gap-1 text-[#17cfc8] dark:text-[#4338ca] text-sm font-medium bg-[#17cfc8]/10 dark:bg-[#4338ca]/20 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 mt-1">
                                <Star className="h-3.5 w-3.5" />
                                <span>+{repo.currentStars.toLocaleString()}</span>
                              </div>
                            </div>

                            {repo.language && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-[#17cfc8] dark:bg-[#4338ca] mr-1.5"></span>
                                <span className="truncate">{repo.language}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="flex-grow flex flex-col pb-4">
                          <div className="text-gray-600 dark:text-gray-300 text-sm mb-auto">
                            {repo.description ? (
                              <div className="line-clamp-3">{repo.description}</div>
                            ) : (
                              <div className="italic text-gray-400 dark:text-gray-500">沒有描述</div>
                            )}
                          </div>

                          {/* 星星增長情況 */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span>星星增長率</span>
                              <span>{starGainPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#17cfc8] dark:bg-[#4338ca] rounded-full"
                                style={{ width: `${Math.min(starGainPercent * 3, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>

                        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c1322] group-hover:bg-gray-100 dark:group-hover:bg-[#111827] transition-colors mt-auto">
                          <div className="flex items-center text-sm text-gray-700 dark:text-white">
                            <Star className="h-4 w-4 mr-1 text-[#17cfc8] dark:text-[#4338ca]" />
                            <span title="總星星數">{repo.stars.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700 dark:text-white">
                            <GitFork className="h-4 w-4 mr-1 text-[#17cfc8] dark:text-[#4338ca]" />
                            <span title="分叉數">{repo.forks.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-[#0f172a] p-8 rounded-lg border shadow-md">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full bg-[#17cfc8]/10 dark:bg-[#4338ca]/20 flex items-center justify-center">
                  <Star className="h-10 w-10 text-[#17cfc8] dark:text-[#4338ca]" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-white dark:border-[#0f172a] shadow-sm">
                    <span className="text-xs font-bold text-gray-800 dark:text-white">0</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">沒有找到 {displayLanguage} 相關的{getTimeRangeLabel()}度趨勢專案</h3>
              <p className="text-muted-foreground mb-6 dark:text-white/70">
                這可能是因為資料還未被爬取，或者該語言在目前時間範圍內沒有足夠的活躍度
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="flex items-center gap-2 bg-[#17cfc8] hover:bg-[#17cfc8]/90 dark:bg-[#4338ca] dark:hover:bg-[#4338ca]/90"
                >
                  {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  重新載入
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/languages')}
                  className="flex items-center gap-2 border-[#17cfc8]/30 dark:border-[#4338ca]/30"
                >
                  查看其他語言
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
