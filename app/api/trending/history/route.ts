import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"
import { PROGRAMMING_LANGUAGES, TABLE_NAME_MAP } from "@/app/lib/constants"

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

export async function GET(request: NextRequest) {
  try {
    // 獲取查詢參數
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('language')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const timeRange = searchParams.get('timeRange') as 'daily' | 'weekly' | 'monthly' || 'daily'

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: "需要提供 startDate 和 endDate 參數" },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateParam)
    const endDate = new Date(endDateParam)

    // 如果沒有指定語言，無法查詢
    if (!language || language === 'all') {
      return NextResponse.json(
        { error: "使用新的資料結構時需要指定語言參數" },
        { status: 400 }
      )
    }

    // 將時間範圍首字母大寫
    const timeRangeCapitalized = timeRange.charAt(0).toUpperCase() + timeRange.slice(1) as 'Daily' | 'Weekly' | 'Monthly';

    // 獲取對應的資料表名稱
    const tableName = getTableName(language, timeRangeCapitalized);
    console.log(`查詢歷史趨勢: ${language}, 時間範圍: ${timeRange}, 資料表: ${tableName}`);

    // 使用原生 SQL 查詢，因為我們需要動態表名
    const repositoriesQuery = Prisma.sql`
      SELECT * FROM "${Prisma.raw(tableName)}"
      WHERE "scrapedAt" >= ${startDate.toISOString()} AND "scrapedAt" <= ${endDate.toISOString()}
      ORDER BY "scrapedAt" DESC, "currentStars" DESC;
    `;

    // 執行查詢
    const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

    // 處理數據，轉換BigInt
    const repositories = rawRepositories.map(processRepository);

    // 確保有足夠數據
    if (repositories.length === 0) {
      console.log(`沒有找到 ${language} ${timeRange} 歷史趨勢專案，返回空數組`);
    } else {
      console.log(`找到 ${repositories.length} 個 ${language} ${timeRange} 歷史趨勢專案`);
    }

    return NextResponse.json(repositories)
  } catch (error) {
    console.error("API error fetching historical data:", error)
    return NextResponse.json(
      { error: "載入歷史數據失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
