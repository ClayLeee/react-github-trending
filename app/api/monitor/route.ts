import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getServerStatus } from "@/app/lib/monitor"
import { Prisma } from "@prisma/client"
import { PROGRAMMING_LANGUAGES } from "@/app/lib/constants"

// 系統啟動時間
const systemStartTime = new Date()

// 輔助函數：將可能的 BigInt 轉換為 Number
function safeBigIntToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  return Number(value) || 0;
}

// 獲取語言特定資料表名稱
function getTableName(language: string, timeRange: 'Daily' | 'Weekly' | 'Monthly'): string {
  // 對 C++ 和 C# 特殊處理
  if (language.toLowerCase() === 'c++') {
    return `CPP${timeRange}Repository`;
  }
  if (language.toLowerCase() === 'c#') {
    return `CSharp${timeRange}Repository`;
  }

  // 使用首字母大寫
  const formattedLang = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
  return `${formattedLang}${timeRange}Repository`;
}

// 輔助函數：獲取運行時間
function getUptime(): string {
  const now = new Date()
  const uptime = now.getTime() - systemStartTime.getTime()

  const days = Math.floor(uptime / (1000 * 60 * 60 * 24))
  const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}天 ${hours}小時 ${minutes}分鐘`
  } else if (hours > 0) {
    return `${hours}小時 ${minutes}分鐘`
  } else {
    return `${minutes}分鐘`
  }
}

// 抓取狀態列舉
enum ScrapingStatus {
  Idle = "閒置",
  Running = "執行中",
  Completed = "已完成",
  Failed = "失敗",
}

// 相容類型定義，確保與前端組件兼容
export type MonitorData = {
  repositoriesCount: {
    daily: number
    weekly: number
    total: number
  }
  languagesCount: number
  lastScrapingTimes: {
    daily: Date
    weekly: Date
  }
  scrapingStatus: {
    daily: ScrapingStatus
    weekly: ScrapingStatus
  }
  systemStatus: {
    uptime: string
    requestsLastHour: number
    systemLoad: {
      cpu: string
      memory: string
      disk: string
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // 初始化計數變數
    let dailyRepositoriesCount = 0;
    let weeklyRepositoriesCount = 0;
    let totalRepositories = 0;
    let distinctLanguages = new Set<string>();

    let latestDailyScrapedAt: Date | null = null;
    let latestWeeklyScrapedAt: Date | null = null;

    // 遍歷每種程式語言
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        // 計算每日資料數量
        const dailyTableName = getTableName(language, 'Daily');
        const dailyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM "${Prisma.raw(dailyTableName)}";`;
        const dailyResult = await prisma.$queryRaw<[{count: number | bigint}]>(dailyCountQuery);
        const dailyCount = safeBigIntToNumber(dailyResult[0]?.count || 0);
        dailyRepositoriesCount += dailyCount;

        // 計算每週資料數量
        const weeklyTableName = getTableName(language, 'Weekly');
        const weeklyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM "${Prisma.raw(weeklyTableName)}";`;
        const weeklyResult = await prisma.$queryRaw<[{count: number | bigint}]>(weeklyCountQuery);
        const weeklyCount = safeBigIntToNumber(weeklyResult[0]?.count || 0);
        weeklyRepositoriesCount += weeklyCount;

        // 計算總數
        totalRepositories += dailyCount + weeklyCount;

        // 如果有資料，加入到語言集合中
        if (dailyCount > 0 || weeklyCount > 0) {
          distinctLanguages.add(language);
        }

        // 獲取最新每日爬蟲時間
        if (dailyCount > 0) {
          const dailyLatestQuery = Prisma.sql`
            SELECT "scrapedAt" FROM "${Prisma.raw(dailyTableName)}"
            ORDER BY "scrapedAt" DESC LIMIT 1;
          `;
          const dailyLatestResult = await prisma.$queryRaw<[{scrapedAt: Date}]>(dailyLatestQuery);
          if (dailyLatestResult && dailyLatestResult[0]) {
            const scrapedAt = dailyLatestResult[0].scrapedAt;
            if (!latestDailyScrapedAt || scrapedAt > latestDailyScrapedAt) {
              latestDailyScrapedAt = scrapedAt;
            }
          }
        }

        // 獲取最新每週爬蟲時間
        if (weeklyCount > 0) {
          const weeklyLatestQuery = Prisma.sql`
            SELECT "scrapedAt" FROM "${Prisma.raw(weeklyTableName)}"
            ORDER BY "scrapedAt" DESC LIMIT 1;
          `;
          const weeklyLatestResult = await prisma.$queryRaw<[{scrapedAt: Date}]>(weeklyLatestQuery);
          if (weeklyLatestResult && weeklyLatestResult[0]) {
            const scrapedAt = weeklyLatestResult[0].scrapedAt;
            if (!latestWeeklyScrapedAt || scrapedAt > latestWeeklyScrapedAt) {
              latestWeeklyScrapedAt = scrapedAt;
            }
          }
        }
      } catch (err) {
        console.warn(`獲取 ${language} 統計資料失敗:`, err);
        // 繼續處理其他語言
      }
    }

    // 最近爬蟲任務時間，如果未找到則使用當前時間
    const lastScrapingTimes = {
      daily: latestDailyScrapedAt || new Date(),
      weekly: latestWeeklyScrapedAt || new Date()
    }

    // 獲取最近一小時的請求數 (模擬數據)
    const requestsLastHour = Math.floor(Math.random() * 200 + 100)

    // 系統負載 (模擬數據)
    const systemLoad = {
      cpu: `${Math.floor(Math.random() * 40 + 10)}%`,
      memory: `${Math.floor(Math.random() * 30 + 20)}%`,
      disk: `${Math.floor(Math.random() * 20 + 10)}%`
    }

    // 計算自上次更新以來的時間，用於判斷抓取狀態
    const hoursSinceLastDailyUpdate = Math.floor((new Date().getTime() - lastScrapingTimes.daily.getTime()) / (1000 * 60 * 60))
    const hoursSinceLastWeeklyUpdate = Math.floor((new Date().getTime() - lastScrapingTimes.weekly.getTime()) / (1000 * 60 * 60))

    // 根據數據更新時間判斷抓取狀態
    const scrapingStatus = {
      daily: hoursSinceLastDailyUpdate < 24 ? ScrapingStatus.Completed : ScrapingStatus.Idle,
      weekly: hoursSinceLastWeeklyUpdate < 24 * 7 ? ScrapingStatus.Completed : ScrapingStatus.Idle,
    }

    // 如果過期時間太長，標記為失敗
    if (hoursSinceLastDailyUpdate > 48) {
      scrapingStatus.daily = ScrapingStatus.Failed
    }
    if (hoursSinceLastWeeklyUpdate > 24 * 8) {
      scrapingStatus.weekly = ScrapingStatus.Failed
    }

    // 獲取服務器運行狀態
    const serverStatus = await getServerStatus()

    // 組合並返回監控數據
    const monitorData: MonitorData = {
      repositoriesCount: {
        daily: dailyRepositoriesCount,
        weekly: weeklyRepositoriesCount,
        total: totalRepositories
      },
      languagesCount: distinctLanguages.size,
      lastScrapingTimes,
      scrapingStatus,
      systemStatus: {
        uptime: serverStatus.uptime,
        requestsLastHour,
        systemLoad
      }
    }

    return NextResponse.json(monitorData)
  } catch (error) {
    console.error("API error in monitor route:", error)
    return NextResponse.json(
      { error: "Error fetching monitoring data" },
      { status: 500 }
    )
  }
}
