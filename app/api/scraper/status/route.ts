import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 獲取最新的爬蟲記錄
    const latestLog = await prisma.scrapingJobLog.findFirst({
      orderBy: {
        startTime: 'desc'
      }
    })

    if (!latestLog) {
      return NextResponse.json({
        status: 'idle',
        message: '沒有正在執行的任務'
      })
    }

    // 根據記錄狀態返回對應的狀態
    return NextResponse.json({
      status: latestLog.status,
      message: latestLog.message
    })
  } catch (error) {
    console.error('獲取任務狀態失敗:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: '獲取任務狀態失敗'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
