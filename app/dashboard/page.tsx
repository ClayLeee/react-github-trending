"use client"

import React, { useState, useEffect, memo, useCallback } from "react"
import { MainLayout } from "@/app/components/MainLayout"
import {
  ClientCard as Card,
  ClientCardContent as CardContent,
  ClientCardHeader as CardHeader,
  ClientCardTitle as CardTitle,
  ClientCardDescription as CardDescription
} from "@/app/components/ClientCard"
import { ClientButton as Button } from "@/app/components/ClientButton"
import { ClientBadge as Badge } from "@/app/components/ClientBadge"
import { LineChart, PieChart, BarChart } from "@/app/components/Charts"
import {
  Loader2, Star, Calendar, Code, ExternalLink, Trophy, Medal,
  ArrowUpRight, CheckCircle2, XCircle, PlayCircle, BarChart2, TrendingUp, GitFork, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Repository, ScrapingJobLog } from "@/app/lib/types"
import { formatNumber } from "@/app/lib/utils"
import useEmblaCarousel from 'embla-carousel-react'
import { useTheme } from 'next-themes'

// 類型定義
interface EnhancedRepository extends Repository {
  categoryType?: 'daily' | 'weekly' | 'monthly';
  category?: string;
  icon?: React.ComponentType<any>;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface DashboardData {
  totalRepos: number;
  dailyRepos: number;
  weeklyRepos: number;
  monthlyRepos: number;
  languageStats: ChartDataItem[];
  dailyStats: {
    date: string;
    count: number;
  }[];
  topStarRepos: ChartDataItem[];
  dailyTrendingRepos: Repository[];
  weeklyTrendingRepos: Repository[];
  monthlyTrendingRepos: Repository[];
  recentScrapingJobs: ScrapingJobLog[];
  starsGrowthData: {
    date: string;
    value: number;
  }[];
  topLanguagesByWeek: {
    language: string;
    count: number;
    percentage: number;
  }[];
}

// 輪播組件 - 使用memo提高效能
const TrendingProjectsCarousel = memo(({ topRepositories }: { topRepositories: EnhancedRepository[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const carouselRootRef = React.useRef<HTMLDivElement | null>(null)
  const [carouselSelectedIndex, setCarouselSelectedIndex] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const autoplayIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const pauseAutoplayRef = React.useRef(false)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // 自動輪播控制
  useEffect(() => {
    if (!emblaApi || !autoplayEnabled) return;

    // 輪播開始函數
    const startAutoplay = () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = setInterval(() => {
        if (!pauseAutoplayRef.current && !document.hidden) emblaApi.scrollNext();
      }, 5000);
    };

    // 選擇變更監聽
    const onSelect = () => {
      requestAnimationFrame(() => setCarouselSelectedIndex(emblaApi.selectedScrollSnap()));
    };

    // 註冊事件
    emblaApi.on('select', onSelect);
    startAutoplay();

    // 視窗可見性與滾動相關控制
    const handleVisibilityChange = () => {
      pauseAutoplayRef.current = document.hidden;
    };

    const handleScroll = () => {
      pauseAutoplayRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        pauseAutoplayRef.current = false;
      }, 1000);
    };

    // 註冊全局事件監聽
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 清理函數
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (emblaApi) emblaApi.off('select', onSelect);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [emblaApi, autoplayEnabled]);

  // 輪播元素可見性監控
  useEffect(() => {
    const element = carouselRootRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => { pauseAutoplayRef.current = !entry.isIntersecting; },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  // 輪播控制按鈕
  const NavigationButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
      onClick={onClick}
      className="p-1.5 rounded-full bg-[#17cfc8]/20 hover:bg-[#17cfc8]/30 transition-colors dark:bg-[#4338ca]/30 dark:hover:bg-[#4338ca]/50"
      aria-label={label}
    >
      {icon}
    </button>
  );

  // 輪播項目卡片渲染
  const renderRepositoryCard = (repo: EnhancedRepository, index: number) => {
    return (
      <div className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2" key={index}>
        <div className="m-2">
          <Card className={`overflow-hidden shadow hover:shadow-lg transition-all hover:scale-[1.02] h-full group border-0 bg-[#dcfce7] dark:bg-[#172554] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl`}>
            <CardHeader className="flex flex-row items-start space-y-0 pb-2">
              <div className="flex-1 min-w-0 pr-2">
                <Link
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md font-semibold truncate hover:underline flex-1 line-clamp-1 transition-colors duration-300 text-gray-800 hover:text-[#17cfc8] dark:text-white dark:group-hover:text-gray-200"
                  title={`${repo.owner}/${repo.name}`}
                >
                  {repo.owner}/{repo.name}
                </Link>
              </div>
              <Link
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-white/50 transition-colors flex-shrink-0 dark:hover:bg-[#4338ca]/30"
              >
                <ExternalLink className="h-4 w-4 text-[#17cfc8] dark:text-white" />
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-4 h-20 dark:text-white/80">
                {repo.description || "No description"}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-white/50 dark:bg-[#4338ca]/30">
                    <Star className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-white">{formatNumber(repo.stars)}</span>
                </div>
                {repo.language && (
                  <Badge variant="secondary" className="text-xs truncate max-w-[120px] bg-white/50 text-[#17cfc8] dark:bg-[#4338ca]/30 dark:text-white">
                    {repo.language}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="relative -mx-4 md:-mx-0" ref={carouselRootRef}>
      {/* 頁首 */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-0">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
            <Star className="h-5 w-5 text-[#17cfc8] dark:text-white" />
          </div>
          <span className="text-gray-800 dark:text-white">趨勢項目列表</span>
        </h3>
        <div className="flex gap-2">
          <NavigationButton
            onClick={() => emblaApi?.scrollPrev()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17cfc8] dark:text-white"><polyline points="15 18 9 12 15 6"></polyline></svg>}
            label="上一個"
          />
          <NavigationButton
            onClick={() => setAutoplayEnabled(!autoplayEnabled)}
            icon={autoplayEnabled ?
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17cfc8] dark:text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17cfc8] dark:text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            }
            label={autoplayEnabled ? "暫停自動輪播" : "開始自動輪播"}
          />
          <NavigationButton
            onClick={() => emblaApi?.scrollNext()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17cfc8] dark:text-white"><polyline points="9 18 15 12 9 6"></polyline></svg>}
            label="下一個"
          />
        </div>
      </div>

      {/* 輪播內容 */}
      <div className="overflow-hidden px-4 md:px-0" ref={emblaRef}>
        <div className="flex flex-nowrap">
          {topRepositories.length > 0 ?
            topRepositories.map((repo, i) => renderRepositoryCard(repo, i)) :
            <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">暫無數據</div>
          }
        </div>
      </div>

      {/* 分頁指示器 */}
      {topRepositories.length > 0 && (
        <div className="flex justify-center gap-1 mt-4">
          {topRepositories.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${carouselSelectedIndex === index ? 'bg-[#17cfc8]' : 'bg-[#17cfc8]/30'} dark:${carouselSelectedIndex === index ? 'bg-[#4338ca]' : 'bg-[#4338ca]/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TrendingProjectsCarousel.displayName = 'TrendingProjectsCarousel';

// 圖表容器 - 避免輪播重新渲染影響圖表
const ChartContainer = memo(({ children }: { children: React.ReactNode }) => children);
ChartContainer.displayName = 'ChartContainer';

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

// 儀表板主組件
export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // 狀態定義
  const [data, setData] = useState<DashboardData | null>(null);
  const [champions, setChampions] = useState<EnhancedRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // 獲取儀表板數據
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error(`API 回應錯誤: ${response.status}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
      await fetchChampions();
    } catch (err) {
      setError(`載入儀表板數據失敗: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 獲取冠軍資料
  const fetchChampions = async () => {
    try {
      const championData: EnhancedRepository[] = [];
      const categories = [
        { type: 'monthly', label: '每月冠軍', icon: Trophy },
        { type: 'weekly', label: '每週冠軍', icon: Trophy },
        { type: 'daily', label: '每日冠軍', icon: Trophy }
      ];

      for (const cat of categories) {
        const response = await fetch(`/api/trending/repositories/${cat.type}?pageSize=1`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
          championData.push({
              ...data.data[0],
              categoryType: cat.type as 'monthly' | 'weekly' | 'daily',
              category: cat.label,
              icon: cat.icon
            });
          }
        }
      }

      setChampions(championData);
    } catch (error) {
      console.error('Error fetching champions:', error);
    }
  };

  // 獲取熱門專案 (合併月週日數據並按星星數排序)
  const getTopRepositories = (): EnhancedRepository[] => {
    if (!data) return [];

    // 優先使用每週趨勢數據，並添加categoryType
    let allRepos: EnhancedRepository[] = [...(data.weeklyTrendingRepos || [])].map(repo => ({
      ...repo,
      categoryType: 'weekly' as const
    }));

    // 如果數量不足，補充每日趨勢數據
    if (allRepos.length < 3 && data.dailyTrendingRepos) {
      const dailyUnique = data.dailyTrendingRepos
        .filter(daily => !allRepos.some(weekly => weekly.repoId === daily.repoId))
        .map(repo => ({ ...repo, categoryType: 'daily' as const }));
      allRepos = [...allRepos, ...dailyUnique];
    }

    // 如果仍不足，補充月度趨勢數據
    if (allRepos.length < 3 && data.monthlyTrendingRepos) {
      const monthlyUnique = data.monthlyTrendingRepos
        .filter(monthly => !allRepos.some(repo => repo.repoId === monthly.repoId))
        .map(repo => ({ ...repo, categoryType: 'monthly' as const }));
      allRepos = [...allRepos, ...monthlyUnique];
    }

    // 按照總星星數排序
    return allRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5);
  };

  // 首次載入時獲取數據
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 狀態卡數據定義
  const stats: StatCard[] = data ? [
    {
      title: "總項目數",
      value: data.totalRepos?.toString() || "0",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      description: "系統中的項目總數",
      color: "blue"
    },
    {
      title: "每日趨勢數",
      value: data.dailyRepos?.toString() || "0",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-500">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      description: "當前每日趨勢項目數量",
      color: "purple"
    },
    {
      title: "每週趨勢數",
      value: data.weeklyRepos?.toString() || "0",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
          <path d="M3 9h18" />
        </svg>
      ),
      description: "當前每週趨勢項目數量",
      color: "green"
    },
    {
      title: "每月趨勢數",
      value: data.monthlyRepos?.toString() || "0",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-500">
          <path d="M2 12h20M2 12a10 10 0 0 1 20 0M2 12a10 10 0 0 0 20 0M4 12a8 8 0 0 1 16 0M4 12a8 8 0 0 0 16 0M6 12a6 6 0 0 1 12 0M6 12a6 6 0 0 0 12 0M8 12a4 4 0 0 1 8 0M8 12a4 4 0 0 0 8 0M10 12a2 2 0 0 1 4 0M10 12a2 2 0 0 0 4 0" />
        </svg>
      ),
      description: "當前每月趨勢項目數量",
      color: "amber"
    }
  ] : [];

  const topRepositories = getTopRepositories();

  // 加載中顯示
  if (isLoading && !data) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-lg">載入儀表板數據中...</div>
        </div>
      </MainLayout>
    );
  }

  // 錯誤顯示
  if (error && !data) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">儀表板</h1>
            <p className="text-destructive">{error}</p>
          </div>
          <Button onClick={fetchDashboardData}>重新嘗試</Button>
        </div>
      </MainLayout>
    );
  }

  // 可重用元件定義
  const DataError = () => (
    <div className="my-8 p-4 border rounded-lg text-center">
      <div className="mb-4 text-destructive">無法載入儀表板數據</div>
      <Button onClick={fetchDashboardData}>重新嘗試</Button>
    </div>
  );

  const RefreshButton = () => (
    <Button
      onClick={fetchDashboardData}
      variant="outline"
      size="sm"
      className="flex items-center gap-1 hover:bg-[#17cfc8]/20 transition-all group text-[#17cfc8] border-[#17cfc8]/30 dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw group-hover:rotate-180 transition-transform duration-500">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
      刷新數據
    </Button>
  );

  // 區段標題元件
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
        {icon}
      </div>
      <span className="text-gray-800 dark:text-white">{title}</span>
    </h3>
  );

  // 主要渲染
  return (
    <MainLayout>
      <div className="main-content">
        {/* 頁面標題 */}
        <div className="page-header">
        <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#17cfc8]/20 backdrop-blur-sm dark:bg-[#4338ca]/30">
                <BarChart2 className="h-6 w-6 text-[#17cfc8] dark:text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">儀表板</h2>
            </div>
            <p className="text-muted-foreground dark:text-white/70 font-light tracking-wide">
              GitHub 趨勢分析即時資訊中心
            </p>
        </div>
        <div className="flex items-center space-x-2">
          <RefreshButton />
        </div>
      </div>

      {/* 檢查資料是否成功載入 */}
        {!data ? <DataError /> : (
          <div className="space-y-8">
          {/* 統計卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              {stats.map((stat, index) => {
                // 樣式配置
                const darkBgColors = [
                  "dark:bg-[#312e81]", "dark:bg-[#312e81]", "dark:bg-[#312e81]", "dark:bg-[#312e81]"
                ];
                const lightColors = [
                  { bg: "bg-[#f0fdf4]", hover: "hover:bg-[#f0fdf4]/20", border: "border-[#f0fdf4]/30", text: "text-[#17cfc8]" },
                  { bg: "bg-[#f0fdf4]", hover: "hover:bg-[#f0fdf4]/20", border: "border-[#f0fdf4]/30", text: "text-[#17cfc8]" },
                  { bg: "bg-[#f0fdf4]", hover: "hover:bg-[#f0fdf4]/20", border: "border-[#f0fdf4]/30", text: "text-[#17cfc8]" },
                  { bg: "bg-[#f0fdf4]", hover: "hover:bg-[#f0fdf4]/20", border: "border-[#f0fdf4]/30", text: "text-[#17cfc8]" }
                ];

                const lightColor = lightColors[index % lightColors.length];
                const darkBgColor = darkBgColors[index % darkBgColors.length];

                return (
                  <Card
                    key={index}
                    className={`transition-all shadow hover:shadow-lg hover:scale-[1.02] overflow-hidden group
                    ${lightColor.bg} ${lightColor.hover} border ${lightColor.border} ${darkBgColor} dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl`}
                  >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">
                    {stat.title}
                  </CardTitle>
                      <div className={`p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors duration-300 dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50`}>
                  {stat.icon}
                      </div>
                </CardHeader>
                    <CardContent className="pt-4">
                      <div className={`text-2xl font-bold ${lightColor.text} transition-colors duration-300 dark:text-white`}>
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-300/70">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
                );
              })}
          </div>

          {/* Champion 區域 */}
            <div className="relative">
              <SectionHeader icon={<Medal className="h-5 w-5 text-[#17cfc8] dark:text-white" />} title="熱門項目" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {champions.length > 0 ? (
                  champions.map((repo, index) => {
                    return (
                  <Card
                    key={repo.id}
                        className={`overflow-hidden transition-all shadow hover:shadow-lg hover:scale-[1.02] group
                        bg-[#dcfce7] dark:bg-[#172554] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl`}
                  >
                        <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                                {repo.categoryType === 'monthly' ? (
                                  <Medal className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                ) : repo.categoryType === 'weekly' ? (
                                  <Medal className="h-5 w-5 text-[#17cfc8] dark:text-blue-400" />
                                ) : (
                                  <Trophy className="h-5 w-5 text-[#17cfc8] dark:text-purple-400" />
                                )}
                              </div>
                              <CardTitle className="text-sm font-bold text-gray-800 dark:text-white">
                            {repo.category}
                          </CardTitle>
                        </div>

                        <Link
                              href={`/${repo.categoryType}`}
                          title={`查看所有${repo.categoryType === 'monthly' ? '每月' : repo.categoryType === 'weekly' ? '每週' : '每日'}趨勢`}
                              className="p-1.5 rounded-full hover:bg-white/50 transition-colors flex items-center justify-center relative overflow-hidden group-hover:bg-white/70 dark:hover:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50"
                        >
                              <ArrowUpRight className="h-4 w-4 text-[#17cfc8] relative z-10 dark:text-white" />
                        </Link>
                      </div>
                    </CardHeader>

                    {/* Repository Card Content */}
                        <CardContent className="p-4 relative">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                          <Link
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                                className="text-md font-semibold truncate hover:underline flex-1 line-clamp-1 transition-colors duration-300 text-gray-800 hover:text-[#17cfc8] dark:text-white dark:group-hover:text-gray-200"
                                title={`${repo.owner}/${repo.name}`}
                          >
                            {repo.owner}/{repo.name}
                          </Link>
                              <Link
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-full hover:bg-white/50 transition-colors dark:hover:bg-[#4338ca]/30"
                              >
                                <ExternalLink className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                              </Link>
                        </div>

                            <p className="text-sm text-gray-600 line-clamp-4 h-20 dark:text-white/80">
                          {repo.description || "No description"}
                        </p>

                            <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-white/50 dark:bg-[#4338ca]/30">
                                  <Star className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-white">{formatNumber(repo.stars)}</span>
                          </div>

                              <div className="flex items-center gap-1 px-2 py-1 bg-white/50 rounded-full text-[#17cfc8] group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/20 dark:text-white dark:group-hover:bg-[#4338ca]/30">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-xs font-semibold">+{formatNumber(repo.currentStars)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    );
                  })
              ) : (
                  <div className="col-span-3 p-4 border rounded-lg text-center text-muted-foreground dark:text-white/70 dark:border-opacity-10 dark:bg-[#312e81]">
                  還沒有趨勢資料可顯示。請等待爬蟲工作完成後再查看。
                </div>
              )}
            </div>
          </div>

            {/* 科技感圖表區域 */}
            <div className="relative">
              <SectionHeader icon={<BarChart2 className="h-5 w-5 text-[#17cfc8] dark:text-white" />} title="數據分析圖表" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 熱門程式語言分佈 */}
                <Card className="col-span-1 md:col-span-5 shadow hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden group bg-white dark:bg-[#1e1b4b] dark:hover:brightness-105 dark:border-opacity-10 dark:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">熱門程式語言分佈</CardTitle>
                      <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                        <svg className="h-4 w-4 text-[#17cfc8] dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                          <circle cx="17" cy="7" r="5" />
                        </svg>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-white/70">
                      所有趨勢項目的語言統計
                </CardDescription>
              </CardHeader>
                  <CardContent className="p-4">
                    {data.languageStats && data.languageStats.length > 0 ? (
                      <ChartContainer>
                      <div className="h-[300px] w-full flex items-center justify-center">
                        <PieChart
                          data={data.languageStats.slice(0, 7)}
                          height={300}
                    />
                  </div>
                      </ChartContainer>
                ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-white/70">
                    暫無數據
                  </div>
                )}
              </CardContent>
            </Card>

                {/* 熱門項目星星分佈 */}
                <Card className="col-span-1 md:col-span-7 shadow hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden group bg-white dark:bg-[#1e1b4b] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                      <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">熱門項目星星分佈</CardTitle>
                      <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                        <Star className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                      </div>
                </div>
                    <CardDescription className="text-gray-600 dark:text-white/70">
                      前 5 個熱門項目的星星數量比較
                </CardDescription>
              </CardHeader>
                  <CardContent className="p-4">
                    {data.topStarRepos && data.topStarRepos.length > 0 ? (
                      <ChartContainer>
                      <div className="h-[300px] w-full pr-4">
                        <BarChart
                          data={data.topStarRepos.slice(0, 5)}
                          height={300}
                    />
                  </div>
                      </ChartContainer>
                ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-white/70">
                    暫無數據
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            </div>

            {/* 趨勢分析卡片 */}
            <div className="relative">
              <SectionHeader icon={<TrendingUp className="h-5 w-5 text-[#17cfc8] dark:text-white" />} title="趨勢分析" />

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 每週星星增長趨勢卡片 */}
                <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden group bg-white dark:bg-[#1e1b4b] dark:hover:brightness-105 dark:border-opacity-10 dark:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">每週星星增長趨勢</CardTitle>
                      <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                        <TrendingUp className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-white/70">
                      熱門項目每週星星增長數據分析
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[250px] w-full">
                      {data.starsGrowthData && data.starsGrowthData.length > 0 ? (
                        <ChartContainer>
                        <LineChart
                          data={data.starsGrowthData.slice(0, 7).map(item => ({
                            name: item.date,
                            value: item.value
                          }))}
                          height={250}
                        />
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-white/70">
                          暫無數據
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 熱門項目類型分析卡片 */}
                <Card className="shadow hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden group bg-white dark:bg-[#1e1b4b] dark:hover:brightness-110 dark:border-opacity-10 dark:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md transition-colors duration-300 text-gray-800 dark:text-white">熱門項目類型分析</CardTitle>
                      <div className="p-1.5 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors dark:bg-[#4338ca]/30 dark:group-hover:bg-[#4338ca]/50">
                        <BarChart2 className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-white/70">
                      熱門項目按照類型分類
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[250px] w-full">
                      {data.languageStats && data.languageStats.length > 0 ? (
                        <ChartContainer>
                        <PieChart
                          data={[
                            { name: '應用程式', value: 35 },
                            { name: '函式庫', value: 25 },
                            { name: '框架', value: 20 },
                            { name: '工具', value: 15 },
                            { name: '其他', value: 5 }
                          ]}
                          height={250}
                        />
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-white/70">
                          暫無數據
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 熱門項目區域 - 使用隔離的 Carousel 組件 */}
            {data && <TrendingProjectsCarousel topRepositories={getTopRepositories()} />}

          {/* 爬蟲歷史記錄 */}
            <div className="relative">
              <SectionHeader icon={<RefreshCw className="h-5 w-5 text-[#17cfc8] dark:text-white" />} title="爬蟲歷史記錄" />

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
                    {data.recentScrapingJobs && data.recentScrapingJobs.length > 0 ? (
                        data.recentScrapingJobs
                          .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                          .map((job, i) => (
                          <tr key={i} className="hover-lift hover:bg-white/50 border-b border-[#17cfc8]/20 dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/10">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-white/50 dark:bg-[#4338ca]/30">
                                  <RefreshCw className="h-4 w-4 text-[#17cfc8] dark:text-white" />
                                </div>
                                <span className="font-medium text-gray-800 dark:text-white">{getTaskName(job.jobName)}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 md:hidden dark:text-white/70">
                                {format(new Date(job.startTime), 'yyyy-MM-dd HH:mm')}
                                {job.endTime && <span> → {format(new Date(job.endTime), 'yyyy-MM-dd HH:mm')}</span>}
                            </div>
                          </td>
                            <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-white/80">
                            {format(new Date(job.startTime), 'yyyy-MM-dd HH:mm')}
                          </td>
                            <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-white/80">
                            {job.endTime
                              ? format(new Date(job.endTime), 'yyyy-MM-dd HH:mm')
                              : '進行中'
                            }
                          </td>
                          <td className="p-4 align-middle">
                                <StatusIndicator status={job.status} />
                          </td>
                            <td className="p-4 align-middle font-medium text-gray-800 dark:text-white">{job.recordCount || 0} 個</td>
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
              {data.recentScrapingJobs && data.recentScrapingJobs.length > recordsPerPage && (
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

                  {Array.from({ length: Math.min(5, Math.ceil(data.recentScrapingJobs.length / recordsPerPage)) }, (_, i) => {
                    const totalPages = Math.ceil(data.recentScrapingJobs.length / recordsPerPage);
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum
                          ? "bg-[#17cfc8] hover:bg-[#17cfc8]/90 text-white dark:bg-[#4338ca]/50 dark:text-white"
                          : "bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(data.recentScrapingJobs.length / recordsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(data.recentScrapingJobs.length / recordsPerPage)}
                    className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
                  >
                    下一頁
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.ceil(data.recentScrapingJobs.length / recordsPerPage))}
                    disabled={currentPage === Math.ceil(data.recentScrapingJobs.length / recordsPerPage)}
                    className="bg-white/50 border-[#17cfc8]/30 dark:bg-[#172554] dark:text-white dark:border-[#4338ca]/30 dark:hover:bg-[#4338ca]/30"
                  >
                    末頁
                  </Button>
                </div>
              )}
            </div>
          </div>
      )}
      </div>
    </MainLayout>
  );
}
