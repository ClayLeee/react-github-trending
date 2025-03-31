"use client"

import React, { useState, useEffect } from "react"
import { MainLayout } from "@/app/components/MainLayout"
import {
  ClientCard as Card,
  ClientCardContent as CardContent,
  ClientCardHeader as CardHeader,
  ClientCardTitle as CardTitle,
  ClientCardDescription as CardDescription
} from "@/app/components/ClientCard"
import { ClientButton as Button } from "@/app/components/ClientButton"
import { Loader2, PlayCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ScrapingJobLog } from "@/app/lib/types"

// 狀態指示器元件
const StatusIndicator = ({ status }: { status: 'success' | 'running' | 'failure' }) => {
  if (status === 'success') {
    return (
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-full bg-green-500/15 dark:bg-green-500/30">
          <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
        </div>
        <span className="text-green-600 font-medium dark:text-green-400">成功</span>
      </div>
    );
  } else if (status === 'running') {
    return (
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-full bg-[#17cfc8]/30 dark:bg-blue-500/30">
          <PlayCircle className="h-4 w-4 text-[#17cfc8] animate-pulse dark:text-blue-400" />
        </div>
        <span className="text-[#17cfc8] font-medium dark:text-blue-400">執行中</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-full bg-red-500/15 dark:bg-red-500/30">
          <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
        </div>
        <span className="text-red-600 font-medium dark:text-red-400">失敗</span>
      </div>
    );
  }
};

// 任務名稱轉換
const getTaskName = (jobName: string) => {
  const taskNames: Record<string, string> = {
    'daily': '每日趨勢爬蟲',
    'weekly': '每週趨勢爬蟲',
    'monthly': '每月趨勢爬蟲',
    'language': '語言趨勢爬蟲',
    'comprehensive': '完整趨勢爬蟲'
  };
  return taskNames[jobName] || jobName;
};

export default function ScraperLogsPage() {
  const [logs, setLogs] = useState<ScrapingJobLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // 獲取爬蟲記錄
  const fetchScraperLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/scraper/logs');
      if (!response.ok) {
        throw new Error(`API 回應錯誤: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(`載入爬蟲記錄失敗: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Error fetching scraper logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 首次載入時獲取數據
  useEffect(() => {
    fetchScraperLogs();
  }, []);

  // 計算正在執行的任務
  const runningTasks = logs.filter(log => log.status === 'running');

  // 計算總頁數
  const totalPages = Math.ceil(logs.length / recordsPerPage);

  // 獲取當前頁的記錄
  const currentLogs = logs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <MainLayout>
      <div className="main-content">
        {/* 頁面標題 */}
        <div className="page-header">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
                <RefreshCw className="h-6 w-6 text-[#17cfc8] dark:text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">爬蟲記錄</h2>
            </div>
            <p className="text-muted-foreground dark:text-white/70 font-light tracking-wide">
              查看系統爬蟲任務的執行記錄和狀態
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchScraperLogs}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:bg-[#17cfc8]/20 transition-all group text-[#17cfc8] border-[#17cfc8]/30 dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
            >
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              刷新記錄
            </Button>
          </div>
        </div>

        {/* 正在執行的任務 */}
        {runningTasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">正在執行的任務</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {runningTasks.map((task) => (
                <Card
                  key={task.id}
                  className="overflow-hidden shadow hover:shadow-lg transition-all hover:scale-[1.02] group bg-white dark:bg-[#1e1b4b] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">
                      {getTaskName(task.jobName)}
                    </CardTitle>
                    <div className="p-1.5 rounded-full bg-[#17cfc8]/20 group-hover:bg-[#17cfc8]/30 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                      <PlayCircle className="h-4 w-4 text-[#17cfc8] animate-pulse dark:text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-600 dark:text-white/70">
                      開始時間：{format(new Date(task.startTime), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                    {task.message && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-white/70">
                        {task.message}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 歷史記錄 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">歷史記錄</h3>
          <div className="table-container dark:bg-[#172554] dark:shadow-xl rounded-lg overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr className="border-b transition-colors border-[#17cfc8]/30 bg-white/50 dark:border-[#4338ca]/30 dark:bg-[#172554]/80">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-800 dark:text-white">任務名稱</th>
                    <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell text-gray-800 dark:text-white">開始時間</th>
                    <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell text-gray-800 dark:text-white">結束時間</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-800 dark:text-white">狀態</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-800 dark:text-white">處理數量</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-[#17cfc8]" />
                          <span className="text-gray-600 dark:text-white/70">載入中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-red-500 dark:text-red-400">
                        {error}
                      </td>
                    </tr>
                  ) : currentLogs.length > 0 ? (
                    currentLogs.map((log) => (
                      <tr key={log.id} className="hover-lift hover:bg-white/50 border-b border-[#17cfc8]/20 dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/10">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-white/50 dark:bg-[#4338ca]/30">
                              <RefreshCw className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">{getTaskName(log.jobName)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 md:hidden dark:text-white/70">
                            {format(new Date(log.startTime), 'yyyy-MM-dd HH:mm')}
                            {log.endTime && <span> → {format(new Date(log.endTime), 'yyyy-MM-dd HH:mm')}</span>}
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-white/80">
                          {format(new Date(log.startTime), 'yyyy-MM-dd HH:mm')}
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-white/80">
                          {log.endTime ? format(new Date(log.endTime), 'yyyy-MM-dd HH:mm') : '進行中'}
                        </td>
                        <td className="p-4 align-middle">
                          <StatusIndicator status={log.status} />
                        </td>
                        <td className="p-4 align-middle font-medium text-gray-800 dark:text-white">
                          {log.recordCount || 0} 個
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-white/70">
                        暫無爬蟲記錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分頁控制 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-1 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
              >
                首頁
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
              >
                上一頁
              </Button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1
                    ? "bg-[#17cfc8] hover:bg-[#17cfc8]/90 text-white dark:bg-[#4338ca]/50 dark:text-white"
                    : "bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
              >
                下一頁
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
              >
                末頁
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
