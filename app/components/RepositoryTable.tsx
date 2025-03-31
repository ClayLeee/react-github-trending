"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ExternalLink, Star, Search, ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from "lucide-react"
import { formatNumber, getLanguageColor } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

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
  trendingDate: string | Date  // 趨勢日期
  isDaily?: boolean     // 是否為每日趨勢
  isWeekly?: boolean    // 是否為每週趨勢
}

interface RepositoryTableProps {
  repositories: Repository[]
  timeRange?: "daily" | "weekly" | "monthly"
}

export function RepositoryTable({ repositories, timeRange = "daily" }: RepositoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [sortField, setSortField] = useState<'currentStars' | 'stars'>('currentStars')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // 排序和過濾資料
  useEffect(() => {
    let processed = [...repositories];

    // 首先過濾
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase()
      processed = processed.filter(repo =>
        repo.name.toLowerCase().includes(searchTermLower) ||
        repo.owner.toLowerCase().includes(searchTermLower) ||
        (repo.description && repo.description.toLowerCase().includes(searchTermLower)) ||
        (repo.language && repo.language.toLowerCase().includes(searchTermLower))
      );
    }

    // 然後排序
    processed.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setFilteredRepos(processed);
    setCurrentPage(1);
  }, [repositories, searchTerm, sortField, sortDirection]);

  // 處理排序欄位點擊
  const handleSortClick = (field: 'currentStars' | 'stars') => {
    if (sortField === field) {
      // 如果點擊的是當前排序欄位，則切換排序方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 切換到新欄位時，默認為降序（大到小）
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 計算分頁
  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRepos.slice(indexOfFirstItem, indexOfLastItem)

  // 分頁導航
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // 獲取排序圖標
  const getSortIcon = (field: 'currentStars' | 'stars') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ArrowUp className="ml-1 h-3 w-3 inline" /> :
      <ArrowDown className="ml-1 h-3 w-3 inline" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#17cfc8] dark:text-white/70" />
          <Input
            placeholder="搜尋項目名稱、作者或語言..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/50 backdrop-blur-sm border-[#17cfc8]/30 dark:border-[#4338ca]/30 dark:bg-[#1e1b4b] dark:text-white"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-sm text-gray-600 dark:text-white/70">
          <span className="hidden md:inline">顯示 {filteredRepos.length} 筆結果中的 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRepos.length)}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 dark:text-white">{currentPage}/{totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <div className="table-container dark:bg-[#1e1b4b] dark:shadow-xl rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr className="bg-white/50 dark:bg-[#1e1b4b]/80 border-b border-[#17cfc8]/30 dark:border-[#4338ca]/30">
                <th className="w-[60px] text-gray-800 dark:text-white">序號</th>
                <th className="w-[25%] text-gray-800 dark:text-white">項目名稱</th>
                <th className="hidden md:table-cell md:w-[35%] text-gray-800 dark:text-white">項目描述</th>
                <th className="w-[12%] text-gray-800 dark:text-white">語言</th>
                <th
                  className="w-[12%] cursor-pointer text-gray-800 dark:text-white"
                  onClick={() => handleSortClick('stars')}
                >
                  總星數 {getSortIcon('stars')}
                </th>
                <th
                  className="w-[12%] cursor-pointer text-gray-800 dark:text-white"
                  onClick={() => handleSortClick('currentStars')}
                >
                  {timeRange === "daily" ? "今日新增" :
                   timeRange === "weekly" ? "本週新增" : "本月新增"} {getSortIcon('currentStars')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((repo, index) => (
                <tr key={repo.id} className="hover-lift hover:bg-white/50 dark:hover:bg-[#4338ca]/10 border-b border-[#17cfc8]/20 dark:border-[#4338ca]/30">
                  <td className="text-gray-800 dark:text-white">#{indexOfFirstItem + index + 1}</td>
                  <td>
                    <div className="flex flex-col">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 truncate">
                            <Link
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline hover:text-[#17cfc8] dark:text-white dark:hover:text-[#4338ca] flex items-center truncate"
                            >
                              <span className="truncate">{repo.owner}/{repo.name}</span>
                              <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0 text-[#17cfc8] dark:text-white" />
                            </Link>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30">
                          {repo.owner}/{repo.name}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="text-gray-600 dark:text-white/70 hidden md:table-cell">
                    {repo.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate">{repo.description}</div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md bg-white dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30">
                          {repo.description}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    {repo.language && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 truncate">
                            <div className={`h-3 w-3 rounded-full flex-shrink-0 ${getLanguageColor(repo.language)}`} />
                            <span className="truncate text-gray-700 dark:text-white/80">{repo.language}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30">
                          {repo.language}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-gray-800 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#17cfc8] dark:text-[#4338ca] flex-shrink-0" />
                      {formatNumber(repo.stars)}
                    </div>
                  </td>
                  <td className="font-medium text-[#17cfc8] dark:text-white whitespace-nowrap">
                    +{formatNumber(repo.currentStars)}
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-white/70">
                    沒有找到匹配的項目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TooltipProvider>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
          >
            首頁
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
          >
            上一頁
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={i}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(pageNum)}
                className={currentPage === pageNum
                  ? "bg-[#17cfc8] hover:bg-[#17cfc8]/90 text-white dark:bg-[#4338ca]/50 dark:text-white"
                  : "bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
          >
            下一頁
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#1e1b4b] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
          >
            末頁
          </Button>
        </div>
      )}
    </div>
  )
}
