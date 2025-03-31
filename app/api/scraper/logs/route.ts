import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 獲取所有爬蟲記錄，按開始時間降序排序
    const logs = await prisma.scrapingJobLog.findMany({
      orderBy: {
        startTime: 'desc'
      }
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("獲取爬蟲記錄時發生錯誤:", error)
    return NextResponse.json(
      { error: `獲取爬蟲記錄失敗: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
