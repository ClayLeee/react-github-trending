import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"
import { TABLE_NAME_MAP } from "@/app/lib/constants"

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
function getTableName(language: string, timeRange: 'daily' | 'weekly' | 'monthly'): string {
  // 將 C++ 轉換為 CPP
  if (language.toLowerCase() === 'c++') {
    return `CPP${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}Repository`;
  }

  // 將 C# 轉換為 CSharp
  if (language.toLowerCase() === 'c#') {
    return `CSharp${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}Repository`;
  }

  // 使用映射表或者首字母大寫
  const formattedLang = TABLE_NAME_MAP[language.toLowerCase()] ||
    (language.charAt(0).toUpperCase() + language.slice(1).toLowerCase());

  return `${formattedLang}${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}Repository`;
}

export async function GET(request: NextRequest) {
  // 獲取查詢參數
  const searchParams = request.nextUrl.searchParams
  const language = searchParams.get('language')
  const timeRange = searchParams.get('timeRange') as 'daily' | 'weekly' || 'daily'

  try {
    if (!language) {
      return NextResponse.json(
        { error: "缺少必要的語言參數" },
        { status: 400 }
      )
    }

    // 獲取對應的資料表名稱
    const tableName = getTableName(language, timeRange);
    console.log(`查詢語言趨勢: ${language}, 時間範圍: ${timeRange}, 資料表: ${tableName}`);

    // 使用原生 SQL 查詢，因為我們需要動態表名
    const repositoriesQuery = Prisma.sql`
      SELECT * FROM "${Prisma.raw(tableName)}"
      ORDER BY "currentStars" DESC
      LIMIT 50;
    `;

    // 執行查詢
    const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

    // 處理數據，轉換BigInt
    const repositories = rawRepositories.map(processRepository);

    if (repositories.length === 0) {
      console.log(`沒有找到 ${language} ${timeRange} 趨勢資料，返回空數組`);
    } else {
      console.log(`找到 ${repositories.length} 個 ${language} ${timeRange} 趨勢專案`);
    }

    return NextResponse.json(repositories)
  } catch (error) {
    console.error(`API error fetching ${language || 'unknown'} trends:`, error)
    return NextResponse.json(
      { error: "載入數據失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
