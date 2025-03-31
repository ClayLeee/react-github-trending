// 專案資料相關型別
export interface Repository {
  id: number;
  repoId: string;
  name: string;
  owner: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  currentStars: number;
  trendingDate: string;
  isDaily?: boolean;
  isWeekly?: boolean;
  isMonthly?: boolean;
}

// 爬蟲任務執行記錄型別
export interface ScrapingJobLog {
  id: number;
  jobName: string;        // 任務名稱：daily, weekly, language, comprehensive, monthly
  startTime: Date;        // 開始時間
  endTime: Date | null;   // 結束時間，如果為 null 表示正在執行中
  status: 'success' | 'failure' | 'running'; // 執行狀態
  recordCount: number;    // 處理的記錄數量
  message: string | null; // 執行訊息或錯誤訊息
}

// 爬蟲任務執行結果型別
export interface ScrapingResult {
  success: boolean;
  message: string;
  count?: number;
  error?: any;
}

// 儀表板數據型別
export interface DashboardData {
  totalRepos: number;
  dailyRepos: number;
  weeklyRepos: number;
  monthlyRepos: number;
  languageStats: {
    name: string;
    value: number;
  }[];
  dailyStats: {
    date: string;
    count: number;
  }[];
  topStarRepos: {
    name: string;
    value: number;
  }[];
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
