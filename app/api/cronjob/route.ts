import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import { manualRunComprehensiveScraping } from '@/app/lib/scheduler';

const execPromise = promisify(exec);
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { jobType } = await request.json();

    if (!jobType) {
      return NextResponse.json(
        { success: false, message: 'Missing jobType parameter' },
        { status: 400 }
      );
    }

    // 創建爬蟲記錄
    const jobLog = await prisma.scrapingJobLog.create({
      data: {
        jobName: jobType,
        startTime: new Date(),
        status: 'running',
        message: `開始執行 ${jobType} 爬蟲任務`
      }
    });

    try {
      let result;
      if (jobType === 'comprehensive') {
        // 直接調用 scheduler 中的函數，而不是執行命令
        result = await manualRunComprehensiveScraping();
      } else {
        // 其他任務仍然使用命令執行
        let command: string;
        switch (jobType) {
          case 'daily':
            command = 'pnpm cron:daily';
            break;
          case 'weekly':
            command = 'pnpm cron:weekly';
            break;
          case 'monthly':
            command = 'pnpm cron:monthly';
            break;
          case 'comprehensive':
            command = 'pnpm cron:comprehensive';
            break;
          case 'languages':
            command = 'pnpm scrape:languages';
            break;
          default:
            return NextResponse.json(
              { success: false, message: `未知的任務類型: ${jobType}` },
              { status: 400 }
            );
        }

        await execPromise(command);
        result = { success: true, message: `任務 ${jobType} 已啟動` };
      }

      // 更新爬蟲記錄
      await prisma.scrapingJobLog.update({
        where: { id: jobLog.id },
        data: {
          endTime: new Date(),
          status: result.success ? 'success' : 'failure',
          message: result.message
        }
      });

      return NextResponse.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      // 更新爬蟲記錄為失敗狀態
      await prisma.scrapingJobLog.update({
        where: { id: jobLog.id },
        data: {
          endTime: new Date(),
          status: 'failure',
          message: `執行任務失敗：${error instanceof Error ? error.message : String(error)}`
        }
      });

      console.error(`Error executing cronjob ${jobType}:`, error);
      return NextResponse.json(
        {
          success: false,
          message: `執行任務失敗：${error instanceof Error ? error.message : String(error)}`
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing cronjob request:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
