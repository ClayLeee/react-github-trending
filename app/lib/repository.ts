import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import { PROGRAMMING_LANGUAGES, TABLE_NAME_MAP } from './constants';

// 輔助函數：將可能的 BigInt 轉換為 Number
function safeBigIntToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  return Number(value) || 0;
}

// 處理數據庫返回的物件，轉換BigInt
function processRepository(repo: any): any {
  return {
    ...repo,
    id: safeBigIntToNumber(repo.id),
    stars: safeBigIntToNumber(repo.stars),
    forks: safeBigIntToNumber(repo.forks),
    currentStars: safeBigIntToNumber(repo.currentStars),
    scrapedAt: repo.scrapedAt,
    createdAt: repo.createdAt,
    updatedAt: repo.updatedAt
  };
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

  // 使用 TABLE_NAME_MAP 或首字母大寫
  const formattedLang = TABLE_NAME_MAP[language.toLowerCase()] ||
    (language.charAt(0).toUpperCase() + language.slice(1).toLowerCase());

  return `${formattedLang}${timeRange}Repository`;
}

/**
 * 獲取每日熱門項目
 * @param language 可選的語言過濾條件
 * @param limit 返回項目數量限制
 */
export async function getDailyTrendingRepositories(language?: string, limit = 25) {
  try {
    // 集合所有符合條件的倉庫
    const allRepositories: any[] = [];

    // 如果指定了特定語言
    if (language && language !== 'all') {
      try {
        const tableName = getTableName(language, 'Daily');

        // 為特定語言查詢
        const repositoriesQuery = Prisma.sql`
          SELECT * FROM "${Prisma.raw(tableName)}"
          ORDER BY "currentStars" DESC
          LIMIT ${limit};
        `;

        const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);
        const processedRepositories = rawRepositories.map(processRepository);
        allRepositories.push(...processedRepositories);
      } catch (err) {
        console.warn(`獲取 ${language} 每日趨勢失敗:`, err);
      }
    } else {
      // 遍歷所有支持的語言
      let remainingLimit = limit;

      for (const lang of PROGRAMMING_LANGUAGES) {
        if (remainingLimit <= 0) break;

        try {
          const tableName = getTableName(lang, 'Daily');

          // 查詢該語言表中的數據
          const repositoriesQuery = Prisma.sql`
            SELECT * FROM "${Prisma.raw(tableName)}"
            ORDER BY "currentStars" DESC
            LIMIT ${remainingLimit};
          `;

          const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

          // 轉換並加入結果集
          if (rawRepositories.length > 0) {
            const processedRepositories = rawRepositories.map(processRepository);
            allRepositories.push(...processedRepositories);
            remainingLimit -= rawRepositories.length;
          }
        } catch (err) {
          console.warn(`獲取 ${lang} 每日趨勢失敗:`, err);
          // 繼續處理其他語言
        }
      }
    }

    // 依照星星數排序
    return allRepositories.sort((a, b) => b.currentStars - a.currentStars).slice(0, limit);
  } catch (error) {
    console.error("Error fetching daily trending repositories:", error);
    return []; // 返回空數組而不是拋出錯誤
  }
}

/**
 * 獲取每週熱門項目
 * @param language 可選的語言過濾條件
 * @param limit 返回項目數量限制
 */
export async function getWeeklyTrendingRepositories(language?: string, limit = 25) {
  try {
    // 集合所有符合條件的倉庫
    const allRepositories: any[] = [];

    // 如果指定了特定語言
    if (language && language !== 'all') {
      try {
        const tableName = getTableName(language, 'Weekly');

        // 為特定語言查詢
        const repositoriesQuery = Prisma.sql`
          SELECT * FROM "${Prisma.raw(tableName)}"
          ORDER BY "currentStars" DESC
          LIMIT ${limit};
        `;

        const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);
        const processedRepositories = rawRepositories.map(processRepository);
        allRepositories.push(...processedRepositories);
      } catch (err) {
        console.warn(`獲取 ${language} 每週趨勢失敗:`, err);
      }
    } else {
      // 遍歷所有支持的語言
      let remainingLimit = limit;

      for (const lang of PROGRAMMING_LANGUAGES) {
        if (remainingLimit <= 0) break;

        try {
          const tableName = getTableName(lang, 'Weekly');

          // 查詢該語言表中的數據
          const repositoriesQuery = Prisma.sql`
            SELECT * FROM "${Prisma.raw(tableName)}"
            ORDER BY "currentStars" DESC
            LIMIT ${remainingLimit};
          `;

          const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

          // 轉換並加入結果集
          if (rawRepositories.length > 0) {
            const processedRepositories = rawRepositories.map(processRepository);
            allRepositories.push(...processedRepositories);
            remainingLimit -= rawRepositories.length;
          }
        } catch (err) {
          console.warn(`獲取 ${lang} 每週趨勢失敗:`, err);
          // 繼續處理其他語言
        }
      }
    }

    // 依照星星數排序
    return allRepositories.sort((a, b) => b.currentStars - a.currentStars).slice(0, limit);
  } catch (error) {
    console.error("Error fetching weekly trending repositories:", error);
    return []; // 返回空數組而不是拋出錯誤
  }
}

/**
 * 獲取所有支持的語言列表
 */
export async function getLanguages() {
  try {
    // 直接返回所有支持的語言列表
    return PROGRAMMING_LANGUAGES.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error fetching languages:", error);
    return []; // 返回空數組而不是拋出錯誤
  }
}

/**
 * 獲取歷史資料
 * @param startDate 開始日期
 * @param endDate 結束日期
 * @param language 語言過濾條件
 */
export async function getHistoricalData(startDate: Date, endDate: Date, language?: string) {
  try {
    // 必須指定語言
    if (!language || language === 'all') {
      console.warn("必須指定語言來獲取歷史資料");
      return [];
    }

    // 獲取各時間範圍的資料表名
    const dailyTableName = getTableName(language, 'Daily');
    const weeklyTableName = getTableName(language, 'Weekly');
    const monthlyTableName = getTableName(language, 'Monthly');

    // 合併查詢所有時間範圍的數據
    const allData: any[] = [];

    try {
      // 查詢每日資料
      const dailyQuery = Prisma.sql`
        SELECT * FROM "${Prisma.raw(dailyTableName)}"
        WHERE "scrapedAt" >= ${startDate.toISOString()} AND "scrapedAt" <= ${endDate.toISOString()}
        ORDER BY "scrapedAt" ASC, "currentStars" DESC;
      `;
      const dailyRaw = await prisma.$queryRaw<any[]>(dailyQuery);
      allData.push(...dailyRaw.map(processRepository));
    } catch (err) {
      console.warn(`獲取 ${language} 每日歷史數據失敗:`, err);
    }

    try {
      // 查詢每週資料
      const weeklyQuery = Prisma.sql`
        SELECT * FROM "${Prisma.raw(weeklyTableName)}"
        WHERE "scrapedAt" >= ${startDate.toISOString()} AND "scrapedAt" <= ${endDate.toISOString()}
        ORDER BY "scrapedAt" ASC, "currentStars" DESC;
      `;
      const weeklyRaw = await prisma.$queryRaw<any[]>(weeklyQuery);
      allData.push(...weeklyRaw.map(processRepository));
    } catch (err) {
      console.warn(`獲取 ${language} 每週歷史數據失敗:`, err);
    }

    try {
      // 查詢每月資料
      const monthlyQuery = Prisma.sql`
        SELECT * FROM "${Prisma.raw(monthlyTableName)}"
        WHERE "scrapedAt" >= ${startDate.toISOString()} AND "scrapedAt" <= ${endDate.toISOString()}
        ORDER BY "scrapedAt" ASC, "currentStars" DESC;
      `;
      const monthlyRaw = await prisma.$queryRaw<any[]>(monthlyQuery);
      allData.push(...monthlyRaw.map(processRepository));
    } catch (err) {
      console.warn(`獲取 ${language} 每月歷史數據失敗:`, err);
    }

    // 按日期排序
    return allData.sort((a, b) => {
      // 首先按照爬取日期排序
      const dateA = new Date(a.scrapedAt).getTime();
      const dateB = new Date(b.scrapedAt).getTime();
      if (dateA !== dateB) return dateA - dateB;

      // 然後按照星星數排序
      return b.currentStars - a.currentStars;
    });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return []; // 返回空數組而不是拋出錯誤
  }
}
