import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"
import { format } from "date-fns"
import { TABLE_NAME_MAP, PROGRAMMING_LANGUAGES } from "@/app/lib/constants"

const prisma = new PrismaClient()

// 輔助函數：將可能的 BigInt 轉換為 Number
function safeBigIntToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  return Number(value) || 0;
}

// 輔助函數：根據語言和時間範圍獲取表名
function getTableName(language: string, timeRange: 'Daily' | 'Weekly' | 'Monthly'): string {
  // 對 C++ 和 C# 特殊處理
  if (language.toLowerCase() === 'c++') {
    return `CPP${timeRange}Repository`;
  }
  if (language.toLowerCase() === 'c#') {
    return `CSharp${timeRange}Repository`;
  }

  // 使用 TABLE_NAME_MAP 或首字母大寫
  const formattedLang = TABLE_NAME_MAP[language.toLowerCase()] ||
    (language.charAt(0).toUpperCase() + language.slice(1).toLowerCase());

  return `${formattedLang}${timeRange}Repository`;
}

export async function GET(request: NextRequest) {
  try {
    // 基本統計數據 - 調整為使用新的表結構
    let totalRepos = 0;
    let dailyRepos = 0;
    let weeklyRepos = 0;
    let monthlyRepos = 0;

    // 遍歷所有支持的語言
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        // 獲取每日資料數量
        const dailyTable = getTableName(language, 'Daily');
        const dailyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM ${Prisma.raw(dailyTable)}`;
        const dailyResult = await prisma.$queryRaw<[{count: number}]>`${dailyCountQuery}`;
        const dailyCount = safeBigIntToNumber(dailyResult[0]?.count || 0);
        dailyRepos += dailyCount;

        // 獲取每週資料數量
        const weeklyTable = getTableName(language, 'Weekly');
        const weeklyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM ${Prisma.raw(weeklyTable)}`;
        const weeklyResult = await prisma.$queryRaw<[{count: number}]>`${weeklyCountQuery}`;
        const weeklyCount = safeBigIntToNumber(weeklyResult[0]?.count || 0);
        weeklyRepos += weeklyCount;

        // 獲取每月資料數量
        const monthlyTable = getTableName(language, 'Monthly');
        const monthlyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM ${Prisma.raw(monthlyTable)}`;
        const monthlyResult = await prisma.$queryRaw<[{count: number}]>`${monthlyCountQuery}`;
        const monthlyCount = safeBigIntToNumber(monthlyResult[0]?.count || 0);
        monthlyRepos += monthlyCount;
      } catch (err) {
        console.warn(`Error counting repositories for language ${language}:`, err);
        // 跳過此語言，繼續處理其他語言
      }
    }

    // 計算總數
    totalRepos = dailyRepos + weeklyRepos + monthlyRepos;

    // 語言分佈統計
    const languageStats: { name: string, value: number }[] = [];

    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        let langCount = 0;

        // 嘗試從每日表獲取語言數據
        const dailyTable = getTableName(language, 'Daily');
        const dailyCountQuery = Prisma.sql`SELECT COUNT(*) as count FROM ${Prisma.raw(dailyTable)}`;
        const dailyResult = await prisma.$queryRaw<[{count: number}]>`${dailyCountQuery}`;
        langCount += safeBigIntToNumber(dailyResult[0]?.count || 0);

        // 添加到語言統計
        if (langCount > 0) {
          const displayName = language.charAt(0).toUpperCase() + language.slice(1);
          languageStats.push({
            name: language === 'c++' ? 'C++' : language === 'c#' ? 'C#' : displayName,
            value: langCount
          });
        }
      } catch (err) {
        console.warn(`Error getting language stats for ${language}:`, err);
      }
    }

    // 按數量排序
    languageStats.sort((a, b) => b.value - a.value);

    // 只保留前10個
    const processedLanguageStats = languageStats.slice(0, 10);

    // 日趨勢統計
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)

    // 聚合所有日趨勢數據
    const dailyStats: { date: string, count: number }[] = [];
    const dateMap = new Map<string, number>();

    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const dailyTable = getTableName(language, 'Daily');
        const statsQuery = Prisma.sql`
          SELECT
            strftime('%Y-%m-%d', "scrapedAt") as date,
            COUNT(*) as count
          FROM ${Prisma.raw(dailyTable)}
          WHERE
            "scrapedAt" >= ${sevenDaysAgo.toISOString()}
          GROUP BY date
        `;

        const langStats = await prisma.$queryRaw<{ date: string, count: number }[]>`${statsQuery}`;

        // 合併到日期映射中
        for (const stat of langStats) {
          const date = stat.date;
          const count = safeBigIntToNumber(stat.count);
          dateMap.set(date, (dateMap.get(date) || 0) + count);
        }
      } catch (err) {
        console.warn(`Error getting daily stats for ${language}:`, err);
      }
    }

    // 將映射轉換為陣列
    for (const entry of Array.from(dateMap.entries())) {
      const [date, count] = entry;
      dailyStats.push({ date, count });
    }

    // 排序並格式化
    const formattedDailyStats = dailyStats
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(stat => ({
        date: format(new Date(stat.date), 'MM/dd'),
        count: stat.count
      }));

    // 星星數增長統計 - 過去30天的星星增長趨勢
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    // 聚合所有語言的星星增長
    const starsGrowthMap = new Map<string, number>();

    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const dailyTable = getTableName(language, 'Daily');
        const starsQuery = Prisma.sql`
          SELECT
            strftime('%Y-%m-%d', "scrapedAt") as date,
            SUM(COALESCE("currentStars", 0)) as value
          FROM ${Prisma.raw(dailyTable)}
          WHERE
            "scrapedAt" >= ${thirtyDaysAgo.toISOString()}
          GROUP BY date
        `;

        const langStars = await prisma.$queryRaw<{ date: string, value: number }[]>`${starsQuery}`;

        // 合併到日期映射中
        for (const stat of langStars) {
          const date = stat.date;
          const value = safeBigIntToNumber(stat.value);
          starsGrowthMap.set(date, (starsGrowthMap.get(date) || 0) + value);
        }
      } catch (err) {
        console.warn(`Error getting stars growth for ${language}:`, err);
      }
    }

    // 將映射轉換為陣列
    const starsGrowthData: { date: string, value: number }[] = [];
    for (const entry of Array.from(starsGrowthMap.entries())) {
      const [date, value] = entry;
      starsGrowthData.push({ date, value });
    }

    // 排序並格式化
    const formattedStarsGrowthData = starsGrowthData
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(stat => ({
        date: format(new Date(stat.date), 'MM/dd'),
        value: stat.value
      }));

    // 每週熱門語言排行
    const topLanguagesByWeek: { language: string, count: number }[] = [];

    // 遍歷語言計算每週數量
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const weeklyTable = getTableName(language, 'Weekly');
        const countQuery = Prisma.sql`
          SELECT COUNT(*) as count
          FROM ${Prisma.raw(weeklyTable)}
          WHERE "scrapedAt" >= ${sevenDaysAgo.toISOString()}
        `;

        const countResult = await prisma.$queryRaw<[{count: number}]>`${countQuery}`;
        const count = safeBigIntToNumber(countResult[0]?.count || 0);

        if (count > 0) {
          const displayName = language.charAt(0).toUpperCase() + language.slice(1);
          topLanguagesByWeek.push({
            language: language === 'c++' ? 'C++' : language === 'c#' ? 'C#' : displayName,
            count: count
          });
        }
      } catch (err) {
        console.warn(`Error getting weekly language count for ${language}:`, err);
      }
    }

    // 排序
    topLanguagesByWeek.sort((a, b) => b.count - a.count);

    // 只保留前10個
    const top10Languages = topLanguagesByWeek.slice(0, 10);

    // 計算總數以獲取百分比
    const totalWeekRepos = top10Languages.reduce((sum, lang) => sum + lang.count, 0);

    // 添加百分比
    const topLanguagesWithPercentage = top10Languages.map(lang => ({
      language: lang.language,
      count: lang.count,
      percentage: totalWeekRepos > 0 ? Math.round((lang.count / totalWeekRepos) * 100) : 0
    }));

    // 獲取排名前10的專案（從所有語言中找出前10個最多星星的專案）
    let allReposWithStars: { name: string, stars: number }[] = [];

    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const dailyTable = getTableName(language, 'Daily');
        const starsQuery = Prisma.sql`
          SELECT name, stars
          FROM ${Prisma.raw(dailyTable)}
          ORDER BY stars DESC
          LIMIT 20
        `;

        const languageRepos = await prisma.$queryRaw<{ name: string, stars: number }[]>`${starsQuery}`;

        allReposWithStars = [...allReposWithStars, ...languageRepos.map(repo => ({
          name: repo.name,
          stars: safeBigIntToNumber(repo.stars)
        }))];
      } catch (err) {
        console.warn(`Error getting top star repos for ${language}:`, err);
      }
    }

    // 排序並只保留前10個
    const topStarRepos = allReposWithStars
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // 格式化為圖表需要的格式
    const formattedTopStarRepos = topStarRepos.map(repo => ({
      name: repo.name,
      value: repo.stars
    }));

    // 獲取每日趨勢專案
    let dailyTrendingRepos: any[] = [];

    // 從所有語言中獲取每日趨勢資料並合併
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const dailyTable = getTableName(language, 'Daily');
        const reposQuery = Prisma.sql`
          SELECT *
          FROM ${Prisma.raw(dailyTable)}
          ORDER BY stars DESC
          LIMIT 5
        `;

        const languageRepos = await prisma.$queryRaw<any[]>`${reposQuery}`;

        const processedRepos = languageRepos.map(repo => ({
          ...repo,
          id: safeBigIntToNumber(repo.id),
          stars: safeBigIntToNumber(repo.stars),
          forks: safeBigIntToNumber(repo.forks),
          currentStars: safeBigIntToNumber(repo.currentStars),
          language: language,
          repoId: repo.id,
          trendingDate: repo.scrapedAt,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt
        }));

        dailyTrendingRepos = [...dailyTrendingRepos, ...processedRepos];
      } catch (err) {
        console.warn(`Error getting daily trending repos for ${language}:`, err);
      }
    }

    // 排序並只保留前10個
    dailyTrendingRepos = dailyTrendingRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // 獲取每週趨勢專案
    let weeklyTrendingRepos: any[] = [];

    // 從所有語言中獲取每週趨勢資料並合併
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const weeklyTable = getTableName(language, 'Weekly');
        const reposQuery = Prisma.sql`
          SELECT *
          FROM ${Prisma.raw(weeklyTable)}
          ORDER BY stars DESC
          LIMIT 5
        `;

        const languageRepos = await prisma.$queryRaw<any[]>`${reposQuery}`;

        const processedRepos = languageRepos.map(repo => ({
          ...repo,
          id: safeBigIntToNumber(repo.id),
          stars: safeBigIntToNumber(repo.stars),
          forks: safeBigIntToNumber(repo.forks),
          currentStars: safeBigIntToNumber(repo.currentStars),
          language: language,
          repoId: repo.id,
          trendingDate: repo.scrapedAt,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt
        }));

        weeklyTrendingRepos = [...weeklyTrendingRepos, ...processedRepos];
      } catch (err) {
        console.warn(`Error getting weekly trending repos for ${language}:`, err);
      }
    }

    // 排序並只保留前10個
    weeklyTrendingRepos = weeklyTrendingRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // 獲取每月趨勢專案
    let monthlyTrendingRepos: any[] = [];

    // 從所有語言中獲取每月趨勢資料並合併
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        const monthlyTable = getTableName(language, 'Monthly');
        const reposQuery = Prisma.sql`
          SELECT *
          FROM ${Prisma.raw(monthlyTable)}
          ORDER BY stars DESC
          LIMIT 5
        `;

        const languageRepos = await prisma.$queryRaw<any[]>`${reposQuery}`;

        const processedRepos = languageRepos.map(repo => ({
          ...repo,
          id: safeBigIntToNumber(repo.id),
          stars: safeBigIntToNumber(repo.stars),
          forks: safeBigIntToNumber(repo.forks),
          currentStars: safeBigIntToNumber(repo.currentStars),
          language: language,
          repoId: repo.id,
          trendingDate: repo.scrapedAt,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt
        }));

        monthlyTrendingRepos = [...monthlyTrendingRepos, ...processedRepos];
      } catch (err) {
        console.warn(`Error getting monthly trending repos for ${language}:`, err);
      }
    }

    // 排序並只保留前10個
    monthlyTrendingRepos = monthlyTrendingRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // 獲取最近的爬蟲任務日誌
    let recentScrapingJobs: any[] = [];
    try {
      recentScrapingJobs = await prisma.$queryRaw<any[]>`
        SELECT *
        FROM "ScrapingJobLog"
        ORDER BY "startTime" DESC
      ` || [];

      // 處理 BigInt 問題
      recentScrapingJobs = recentScrapingJobs.map(job => ({
        ...job,
        id: safeBigIntToNumber(job.id),
        recordCount: safeBigIntToNumber(job.recordCount),
        startTime: job.startTime,
        endTime: job.endTime,
        status: job.status,
        message: job.message,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      }));
    } catch (jobError) {
      console.error("Error fetching scraping jobs:", jobError);
      // 繼續執行，不讓這個錯誤影響整個 API
    }

    // 返回所有數據
    return NextResponse.json({
      totalRepos,
      dailyRepos,
      weeklyRepos,
      monthlyRepos,
      languageStats: processedLanguageStats,
      dailyStats: formattedDailyStats,
      topStarRepos: formattedTopStarRepos,
      dailyTrendingRepos,
      weeklyTrendingRepos,
      monthlyTrendingRepos,
      recentScrapingJobs,
      starsGrowthData: formattedStarsGrowthData,
      topLanguagesByWeek: topLanguagesWithPercentage
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get dashboard data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
