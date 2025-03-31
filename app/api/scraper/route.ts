import { NextRequest, NextResponse } from "next/server"
import {
  runScrapingJob,
  TimeRange,
  runLanguageTrendingScraping
} from "@/app/lib/scraper"
import {
  startAllScrapingTasks,
  stopAllScrapingTasks,
  initializeScrapingTasks,
  manualRunDailyTrending,
  manualRunWeeklyTrending,
  manualRunComprehensiveScraping,
  manualRunMonthlyTrending
} from "@/app/lib/scheduler"
import { exec } from "child_process"
import { promisify } from "util"
import { PrismaClient } from "@prisma/client"

const execPromise = promisify(exec)
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // 身份驗證和權限檢查（如果需要）
    const isAdmin = true; // 實際項目中應該從請求中提取實際的角色或權限

    if (!isAdmin) {
      return NextResponse.json({ error: "無權訪問此API" }, { status: 403 });
    }

    // 獲取操作參數
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange');
    const action = searchParams.get('action');

    // 根據參數執行相應操作
    let result: { message: string } = { message: "" };

    if (action === 'start-tasks') {
      // 啟動排程任務
      const taskResult = startAllScrapingTasks();
      result.message = taskResult.message;
    } else if (action === 'stop-tasks') {
      // 停止排程任務
      const taskResult = stopAllScrapingTasks();
      result.message = taskResult.message;
    } else if (timeRange) {
      if (timeRange === 'daily') {
        // 執行每日趨勢爬蟲
        const taskResult = await manualRunDailyTrending();
        result.message = taskResult.message;
      } else if (timeRange === 'weekly') {
        // 執行每週趨勢爬蟲
        const taskResult = await manualRunWeeklyTrending();
        result.message = taskResult.message;
      } else if (timeRange === 'monthly') {
        // 執行每月熱門專案更新
        const taskResult = await manualRunMonthlyTrending();
        result.message = taskResult.message;
      } else if (timeRange === 'language') {
        // 執行語言趨勢爬蟲
        const taskResult = await runLanguageTrendingScraping();
        result.message = taskResult.message;
      } else if (timeRange === 'comprehensive') {
        // 執行完整爬蟲
        const taskResult = await manualRunComprehensiveScraping();
        result.message = taskResult.message;
      } else {
        return NextResponse.json({ error: "無效的時間範圍或操作" }, { status: 400 });
      }
    } else {
      // 如果沒有指定參數，執行完整的爬蟲作業
      const taskResult = await manualRunComprehensiveScraping();
      result.message = taskResult.message;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("執行爬蟲API時發生錯誤:", error);
    return NextResponse.json(
      { error: `爬蟲執行失敗: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// 實作POST方法以支持從管理界面手動觸發
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action parameter" },
        { status: 400 }
      )
    }

    // 創建爬蟲記錄
    const jobLog = await prisma.scrapingJobLog.create({
      data: {
        jobName: action,
        startTime: new Date(),
        status: "running",
        message: `開始執行 ${action} 爬蟲任務`
      }
    })

    try {
      let result
      if (action === "comprehensive") {
        // 直接調用 scheduler 中的函數，而不是執行命令
        result = await manualRunComprehensiveScraping()
      } else if (action === "languages") {
        // 執行語言趨勢爬蟲
        result = await runLanguageTrendingScraping()
      } else {
        // 根據不同的任務執行相應的函數
        switch (action) {
          case "daily":
            result = await manualRunDailyTrending()
            break
          case "weekly":
            result = await manualRunWeeklyTrending()
            break
          case "monthly":
            result = await manualRunMonthlyTrending()
            break
          default:
            return NextResponse.json(
              { success: false, message: "Invalid action parameter" },
              { status: 400 }
            )
        }
      }

      // 更新爬蟲記錄
      await prisma.scrapingJobLog.update({
        where: { id: jobLog.id },
        data: {
          endTime: new Date(),
          status: result.success ? "success" : "failure",
          message: result.message
        }
      })

      return NextResponse.json({
        success: true,
        message: result.message
      })
    } catch (error) {
      // 更新爬蟲記錄為失敗狀態
      await prisma.scrapingJobLog.update({
        where: { id: jobLog.id },
        data: {
          endTime: new Date(),
          status: "failure",
          message: `執行任務失敗：${error instanceof Error ? error.message : String(error)}`
        }
      })

      console.error(`Error executing scraper ${action}:`, error)
      return NextResponse.json(
        {
          success: false,
          message: `執行任務失敗：${error instanceof Error ? error.message : String(error)}`
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error processing scraper request:", error)
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
