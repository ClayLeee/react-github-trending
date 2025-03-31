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

// 處理數據庫返回的仓库對象，轉換BigInt
function processRepository(repo: any): any {
  return {
    ...repo,
    id: safeBigIntToNumber(repo.id),
    stars: safeBigIntToNumber(repo.stars),
    forks: safeBigIntToNumber(repo.forks),
    currentStars: safeBigIntToNumber(repo.currentStars),
    trendingDate: repo.trendingDate,
    createdAt: repo.createdAt,
    updatedAt: repo.updatedAt
  };
}

// 轉換語言名稱為有效的 Prisma 資料表名稱
function getTableName(language: string, timeRange: string): string {
  const lowerLang = language.toLowerCase();

  // 特殊處理 C# 的情況
  if (lowerLang === 'c#' || lowerLang === 'c%23' || lowerLang === 'csharp') {
    const formattedLang = 'CSharp';
    const capitalizedTimeRange = timeRange.charAt(0).toUpperCase() + timeRange.slice(1).toLowerCase();
    return `${formattedLang}${capitalizedTimeRange}Repository`;
  }

  // 使用 TABLE_NAME_MAP 獲取對應的資料表名稱前綴
  // 如果找不到對應，則使用語言名稱的 Pascal Case
  let formattedLang = TABLE_NAME_MAP[lowerLang];

  // 如果在映射表中找不到，則使用首字母大寫的語言名稱
  if (!formattedLang) {
    formattedLang = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
  }

  // 首字母大寫時間範圍
  const capitalizedTimeRange = timeRange.charAt(0).toUpperCase() + timeRange.slice(1).toLowerCase();

  // 組合資料表名稱
  return `${formattedLang}${capitalizedTimeRange}Repository`;
}

// 檢查語言資料表是否存在
function isValidLanguage(language: string): boolean {
  const lowerLang = language.toLowerCase();

  // 特殊處理 c# 的 URL 編碼形式 c%23 和 csharp
  if (lowerLang === 'c%23' || lowerLang === 'csharp') {
    return true; // 轉換為 c# 處理
  }

  // 特殊處理 c++ 的 URL 編碼形式 c%2b%2b
  if (lowerLang === 'c%2b%2b') {
    return true; // 轉換為 c++ 處理
  }

  return PROGRAMMING_LANGUAGES.some(lang => lang.toLowerCase() === lowerLang);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language');
  const timeRange = searchParams.get('timeRange') || 'daily';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // 驗證必要參數
  if (!language) {
    return NextResponse.json({ error: "語言參數是必需的" }, { status: 400 });
  }

  // 驗證時間範圍
  if (!['daily', 'weekly', 'monthly'].includes(timeRange)) {
    return NextResponse.json({ error: "無效的時間範圍，允許的值: daily, weekly, monthly" }, { status: 400 });
  }

  // 規範化語言參數，處理特殊情況
  let normalizedLanguage = language.toLowerCase();

  // 額外處理 c# 的編碼問題
  if (normalizedLanguage === 'c%23' || normalizedLanguage === 'csharp') {
    normalizedLanguage = 'c#';
  }

  // 處理 c++ 的URL編碼問題
  if (normalizedLanguage === 'c%2b%2b') {
    normalizedLanguage = 'c++';
  }

  // 驗證語言是否在支持列表
  if (!isValidLanguage(normalizedLanguage)) {
    return NextResponse.json({
      error: "不支持該語言",
      language: language,
      normalizedLanguage: normalizedLanguage,
      supportedLanguages: PROGRAMMING_LANGUAGES
    }, { status: 400 });
  }

  // 計算分頁偏移
  const skip = (page - 1) * pageSize;

  // 取得對應的資料表名稱
  const tableName = getTableName(normalizedLanguage, timeRange);

  try {
    // 使用原生 SQL 查詢，因為我們需要動態表名
    const countQuery = Prisma.sql`
      SELECT count(*) as total FROM "${Prisma.raw(tableName)}";
    `;

    // 新增調試日誌，顯示正在查詢的資料表名稱
    console.log(`正在查詢資料表: ${tableName}`);

    const repositoriesQuery = Prisma.sql`
      SELECT * FROM "${Prisma.raw(tableName)}"
      ORDER BY "currentStars" DESC
      LIMIT ${pageSize} OFFSET ${skip};
    `;

    // 執行查詢
    const totalResult = await prisma.$queryRaw<[{total: number | bigint}]>(countQuery);
    const total = safeBigIntToNumber(totalResult[0]?.total) || 0;

    const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

    // 增加調試日誌，顯示獲取到的資料結構
    if (rawRepositories && rawRepositories.length > 0) {
      console.log(`獲取到 ${rawRepositories.length} 條記錄，資料樣本:`,
                  JSON.stringify({
                    id: rawRepositories[0].id,
                    owner: rawRepositories[0].owner,
                    name: rawRepositories[0].name,
                    stars: rawRepositories[0].stars,
                    currentStars: rawRepositories[0].currentStars,
                    forks: rawRepositories[0].forks
                  }, null, 2));
    } else {
      console.log(`沒有在 ${tableName} 表中獲取到任何記錄`);
    }

    // 處理數據，轉換BigInt
    const repositories = rawRepositories.map(processRepository);

    // 計算總頁數
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      data: repositories,
      meta: {
        currentPage: page,
        pageSize,
        totalPages,
        total,
        language: normalizedLanguage,
        timeRange
      }
    });
  } catch (error) {
    console.error(`獲取 ${normalizedLanguage} ${timeRange} 趨勢資料出錯:`, error);

    // 更具體的錯誤消息
    let errorMessage = "獲取語言趨勢資料失敗";
    if (error instanceof Error && error.message.includes("does not exist")) {
      errorMessage = `找不到 ${normalizedLanguage} 的 ${timeRange} 趨勢資料表，請確保該語言的資料表已建立`;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error),
        tableName,
        language: normalizedLanguage
      },
      { status: 500 }
    );
  }
}
