import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"
import { PROGRAMMING_LANGUAGES, TABLE_NAME_MAP } from "@/app/lib/constants"

// 語言統計資料的介面
interface LanguageStat {
  language: string;
  repositoryCount: number;
  totalStars: number;
}

// 輔助函數：將可能的 BigInt 轉換為 Number
function safeBigIntToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  return Number(value) || 0;
}

export async function GET(request: NextRequest) {
  try {
    // 獲取查詢參數
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('timeRange') as 'daily' | 'weekly' || 'daily'

    // 初始化語言統計資料
    const languageMap = new Map<string, { count: number, stars: number }>();

    // 設定時間範圍字首
    const timeRangePrefix = timeRange.charAt(0).toUpperCase() + timeRange.slice(1);

    // 針對每種支援的程式語言查詢資料
    for (const language of PROGRAMMING_LANGUAGES) {
      try {
        // 獲取表名
        let tableName = '';

        // 特殊處理 C++ 和 C#
        if (language.toLowerCase() === 'c++') {
          tableName = `CPP${timeRangePrefix}Repository`;
        } else if (language.toLowerCase() === 'c#') {
          tableName = `CSharp${timeRangePrefix}Repository`;
        } else {
          // 一般情況：使用映射表或首字母大寫
          const formattedLang = TABLE_NAME_MAP[language.toLowerCase()] ||
            (language.charAt(0).toUpperCase() + language.slice(1).toLowerCase());
          tableName = `${formattedLang}${timeRangePrefix}Repository`;
        }

        // 查詢該語言資料表的數量和星星總數
        const countQuery = Prisma.sql`
          SELECT COUNT(*) as count, SUM(COALESCE("currentStars", 0)) as stars
          FROM "${Prisma.raw(tableName)}"
        `;

        // 執行查詢
        const result = await prisma.$queryRaw<[{count: number | bigint, stars: number | bigint}]>(countQuery);

        // 如果有資料，加入到映射中
        if (result && result[0]) {
          const count = safeBigIntToNumber(result[0].count);
          const stars = safeBigIntToNumber(result[0].stars);

          if (count > 0) {
            // 設定語言顯示名稱（特殊處理 C++ 和 C#）
            const displayName = language === 'c++' ? 'C++' : language === 'c#' ? 'C#' :
              language.charAt(0).toUpperCase() + language.slice(1);

            languageMap.set(displayName, { count, stars });
          }
        }
      } catch (err) {
        console.warn(`獲取 ${language} 語言統計失敗:`, err);
        // 繼續處理其他語言
      }
    }

    // 轉換為數組並排序
    const formattedStats: LanguageStat[] = [];

    // 使用 Array.from 來解決 Map.entries() 迭代問題
    Array.from(languageMap.entries()).forEach(([language, stats]) => {
      formattedStats.push({
        language,
        repositoryCount: stats.count,
        totalStars: stats.stars
      });
    });

    // 依倉庫數量排序
    formattedStats.sort((a: LanguageStat, b: LanguageStat) => b.repositoryCount - a.repositoryCount);

    console.log(`獲取到 ${formattedStats.length} 種語言的統計資料`);
    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error(`API error fetching language popularity:`, error);
    return NextResponse.json(
      { error: "載入語言熱門度數據失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
