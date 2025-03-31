import { NextRequest, NextResponse } from 'next/server';
import { runScrapingJob } from '@/app/lib/scraper';

// 驗證請求是否來自授權的服務
const validateRequest = (request: NextRequest): boolean => {
  // 正式環境應該使用安全的驗證機制，例如驗證 Authorization 標頭中的 API 金鑰
  // 這裡僅作為示例
  const auth = request.headers.get('Authorization');

  // 在開發環境中，暫時允許所有請求通過
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // 驗證 API 金鑰（正式環境中應改用環境變數儲存的安全金鑰）
  return auth === 'Bearer your-secret-api-key';
};

export async function GET(request: NextRequest) {
  try {
    // 驗證請求
    if (!validateRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 從 URL 參數中獲取時間範圍
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') as 'daily' | 'weekly' || 'daily';

    if (timeRange !== 'daily' && timeRange !== 'weekly') {
      return NextResponse.json(
        { error: 'Invalid timeRange. Must be "daily" or "weekly"' },
        { status: 400 }
      );
    }

    // 執行爬蟲作業
    await runScrapingJob(timeRange);

    return NextResponse.json(
      { success: true, message: `Successfully ran ${timeRange} scraping job` }
    );
  } catch (error) {
    console.error('Error in cron API route:', error);

    return NextResponse.json(
      { error: 'Failed to run scraping job', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST 端點用於觸發兩種爬蟲作業
  try {
    // 驗證請求
    if (!validateRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 執行每日和每週爬蟲作業
    await runScrapingJob('daily');
    await runScrapingJob('weekly');

    return NextResponse.json({
      success: true,
      message: 'Successfully ran both daily and weekly scraping jobs'
    });
  } catch (error) {
    console.error('Error in cron API route:', error);

    return NextResponse.json(
      { error: 'Failed to run scraping jobs', details: (error as Error).message },
      { status: 500 }
    );
  }
}
