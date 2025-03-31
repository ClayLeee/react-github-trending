import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"

// 定義資料庫中儲存庫的介面型別
interface Repository {
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
  trendingDate: Date;
}

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('language')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')

  // 計算分頁偏移
  const skip = (page - 1) * pageSize

  try {
    // 使用原生 SQL 查詢 DailyRepository 表
    let totalQuery = Prisma.sql`SELECT count(*) as total FROM "DailyRepository"`;
    let repositoriesQuery = Prisma.sql`SELECT * FROM "DailyRepository"`;

    // 添加語言過濾條件
    if (lang) {
      totalQuery = Prisma.sql`SELECT count(*) as total FROM "DailyRepository" WHERE language = ${lang}`;
      repositoriesQuery = Prisma.sql`SELECT * FROM "DailyRepository" WHERE language = ${lang}`;
    }

    // 添加排序和分頁
    repositoriesQuery = Prisma.sql`
      SELECT * FROM "DailyRepository"
      ${lang ? Prisma.sql`WHERE language = ${lang}` : Prisma.empty}
      ORDER BY currentStars DESC
      LIMIT ${pageSize} OFFSET ${skip}
    `;

    // 執行查詢
    const totalResult = await prisma.$queryRaw<[{total: number | bigint}]>(totalQuery);
    const total = safeBigIntToNumber(totalResult[0]?.total) || 0;

    const rawRepositories = await prisma.$queryRaw<any[]>(repositoriesQuery);

    // 處理BigInt問題
    const repositories = rawRepositories.map(processRepository);

    // 計算總頁數
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      data: repositories,
      meta: {
        currentPage: page,
        pageSize,
        totalPages,
        total
      }
    });
  } catch (error) {
    console.error("獲取每日趨勢資料出錯:", error)
    return NextResponse.json(
      { error: "獲取每日趨勢數據失敗", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
