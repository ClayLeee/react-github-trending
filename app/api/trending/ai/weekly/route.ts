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
    const limit = parseInt(searchParams.get('limit') || '50') // 預設顯示 50 個

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
      // 遍歷所有支持的語言，獲取 AI 相關項目
      let remainingLimit = limit;

      for (const lang of PROGRAMMING_LANGUAGES) {
        if (remainingLimit <= 0) break;

        try {
          const tableName = getTableName(lang, 'Weekly');

          // 查詢該語言表中的數據
          // 注意：語言特定表沒有 isAI 欄位，這裡先按星星排序取前幾個
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

    // 按星星數排序
    allRepositories.sort((a, b) => b.currentStars - a.currentStars);

    // 限制返回數量
    const limitedRepositories = allRepositories.slice(0, limit);

    // 確保有足夠數據
    if (limitedRepositories.length === 0) {
      console.log("沒有找到每週趨勢專案，返回空數組");
    } else {
      console.log(`找到 ${limitedRepositories.length} 個每週趨勢專案`);
    }

    return NextResponse.json(limitedRepositories)
  } catch (error) {
    console.error("API error fetching weekly trending repositories:", error)
    return NextResponse.json(
      { error: "載入數據失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
