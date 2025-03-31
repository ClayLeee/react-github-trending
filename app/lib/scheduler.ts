import { CronJob } from 'cron';
import {
  runScrapingJob,
  POPULAR_LANGUAGES,
  runLanguageTrendingScraping
} from './scraper';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { parse } from 'node-html-parser';

const prisma = new PrismaClient();

interface SchedulerResult {
  success: boolean;
  message: string;
}

// 爬蟲任務集合
const scrapingJobs: Record<string, CronJob> = {
  // 每天早上 8 點執行每日趨勢爬蟲作業
  dailyScraper: new CronJob(
    '0 8 * * *',
    async () => {
      console.log('Running daily trending scraping job...');
      try {
        await runScrapingJob('daily');
        console.log('Daily trending scraping job completed successfully');
      } catch (error) {
        console.error('Error in daily trending scraping job:', error);
      }
    },
    null, // onComplete
    false, // start
    'Asia/Taipei' // timeZone
  ),

  // 每週一早上 9 點執行每週趨勢爬蟲作業
  weeklyScraper: new CronJob(
    '0 9 * * 1',
    async () => {
      console.log('Running weekly trending scraping job...');
      try {
        await runScrapingJob('weekly');
        console.log('Weekly trending scraping job completed successfully');
      } catch (error) {
        console.error('Error in weekly trending scraping job:', error);
      }
    },
    null,
    false,
    'Asia/Taipei'
  ),

  // 每天午夜 0 點執行完整爬蟲作業 (包含所有程式語言)
  comprehensiveScraper: new CronJob(
    '0 0 * * *',
    async () => {
      console.log('Running comprehensive trending scraping job...');
      try {
        // 執行完整趨勢爬蟲（包含一般趨勢和語言趨勢）
        await manualRunComprehensiveScraping();
        console.log('Comprehensive trending scraping job completed successfully');
      } catch (error) {
        console.error('Error in comprehensive trending scraping job:', error);
      }
    },
    null,
    false,
    'Asia/Taipei'
  ),

  // 每天凌晨 2 點執行程式語言爬蟲作業
  languageScraper: new CronJob(
    '0 2 * * *',
    async () => {
      console.log('Running language-specific trending scraping job...');
      try {
        // 輪流爬取各種語言的趨勢專案
        for (const language of POPULAR_LANGUAGES) {
          console.log(`Scraping ${language} daily trends...`);
          await runScrapingJob('daily', language);
          // 等待一段時間避免被限流
          await new Promise(resolve => setTimeout(resolve, 10000));

          console.log(`Scraping ${language} weekly trends...`);
          await runScrapingJob('weekly', language);
          // 等待一段時間避免被限流
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        console.log('Language-specific scraping job completed successfully');
      } catch (error) {
        console.error('Error in language-specific scraping job:', error);
      }
    },
    null,
    false,
    'Asia/Taipei'
  ),

  // 每個月1號凌晨3點執行更新月度熱門專案
  monthlyScraper: new CronJob(
    '0 3 1 * *',
    async () => {
      console.log('Running monthly trending update job...');
      try {
        await updateMonthlyTrending();
        console.log('Monthly trending update job completed successfully');
      } catch (error) {
        console.error('Error in monthly trending update job:', error);
      }
    },
    null,
    false,
    'Asia/Taipei'
  )
};

/**
 * 更新每月熱門專案
 * 將過去30天內星星增長最多的專案標記為每月熱門
 */
async function updateMonthlyTrending() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 清空現有的月度資料
    await prisma.monthlyRepository.deleteMany({});
    console.log('已清空每月趨勢資料表');

    // 從每日趨勢資料中找出過去30天內星星數增長最多的專案
    const topDailyRepos = await prisma.dailyRepository.findMany({
      where: {
        trendingDate: {
          gte: thirtyDaysAgo
        },
        currentStars: {
          gt: 0
        }
      },
      orderBy: {
        currentStars: 'desc'
      },
      take: 30,
    });

    // 將這些專案添加到每月趨勢資料表
    for (const repo of topDailyRepos) {
      await prisma.monthlyRepository.create({
        data: {
          repoId: repo.repoId,
          name: repo.name,
          owner: repo.owner,
          description: repo.description,
          url: repo.url,
          language: repo.language,
          stars: repo.stars,
          forks: repo.forks,
          currentStars: repo.currentStars,
          trendingDate: new Date()
        }
      });
    }

    console.log(`已更新 ${topDailyRepos.length} 個每月熱門專案`);
    return { success: true, count: topDailyRepos.length };
  } catch (error) {
    console.error(`更新每月熱門專案失敗:`, error);
    return { success: false, error, count: 0 };
  }
}

/**
 * 清空特定爬蟲相關的資料表
 * @param scope 要清空的資料表範圍: 'daily', 'weekly', 'monthly', 'all'
 */
async function clearScrapingData(scope: 'daily' | 'weekly' | 'monthly' | 'all' = 'all') {
  try {
    if (scope === 'daily' || scope === 'all') {
      await prisma.dailyRepository.deleteMany({});
      console.log('已清空每日趨勢資料表');
    }

    if (scope === 'weekly' || scope === 'all') {
      await prisma.weeklyRepository.deleteMany({});
      console.log('已清空每週趨勢資料表');
    }

    if (scope === 'monthly' || scope === 'all') {
      await prisma.monthlyRepository.deleteMany({});
      console.log('已清空每月趨勢資料表');
    }

    if (scope === 'all') {
      console.log('已清空所有爬蟲資料表');
    }
  } catch (error) {
    console.error('清空資料表時發生錯誤:', error);
    throw error;
  }
}

async function scrapeTrending(since: 'daily' | 'weekly' | 'monthly') {
  let scrapingLog;
  try {
    // 創建爬蟲記錄
    scrapingLog = await prisma.scrapingJobLog.create({
      data: {
        jobName: since,
        startTime: new Date(),
        status: 'running',
        message: `開始爬取 ${since} 趨勢資料`
      }
    });

    // 構建 GitHub 趨勢頁面 URL
    const url = `https://github.com/trending?since=${since}`;

    // 發送請求獲取頁面內容
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = parse(response.data);
    const repositories = html.querySelectorAll('article.Box-row');

    let recordCount = 0;

    // 解析每個倉庫的資訊
    for (const repo of repositories) {
      const nameElement = repo.querySelector('h2.h3 a');
      const descriptionElement = repo.querySelector('p');
      const languageElement = repo.querySelector('span[itemprop="programmingLanguage"]');
      const starsElement = repo.querySelector('a.Link--muted:nth-child(1)');
      const forksElement = repo.querySelector('a.Link--muted:nth-child(2)');
      const currentStarsElement = repo.querySelector('span.d-inline-block.float-sm-right');

      if (!nameElement) continue;

      const fullName = nameElement.text.trim();
      const [owner, name] = fullName.split('/');
      const url = `https://github.com${nameElement.getAttribute('href')}`;
      const description = descriptionElement?.text.trim() || null;
      const language = languageElement?.text.trim() || null;
      const stars = parseInt(starsElement?.text.trim().replace(/,/g, '') || '0');
      const forks = parseInt(forksElement?.text.trim().replace(/,/g, '') || '0');
      const currentStars = parseInt(currentStarsElement?.text.trim().replace(/[^0-9]/g, '') || '0');

      // 根據時間範圍保存到對應的資料表
      const baseData = {
        repoId: `${owner}/${name}`,
        owner,
        name,
        url,
        description,
        language: language || 'unknown',
        stars,
        currentStars,
        forks,
        trendingDate: new Date()
      };

      switch (since) {
        case 'daily':
          await prisma.dailyRepository.create({ data: baseData });
          break;
        case 'weekly':
          await prisma.weeklyRepository.create({ data: baseData });
          break;
        case 'monthly':
          await prisma.monthlyRepository.create({ data: baseData });
          break;
      }

      recordCount++;
    }

    // 更新爬蟲記錄
    if (scrapingLog) {
      await prisma.scrapingJobLog.update({
        where: { id: scrapingLog.id },
        data: {
          status: 'completed',
          endTime: new Date(),
          recordCount,
          message: `成功爬取 ${recordCount} 個倉庫`
        }
      });
    }

    console.log(`完成爬取 ${since} 趨勢資料，共 ${recordCount} 個倉庫`);
  } catch (error) {
    console.error(`爬取 ${since} 趨勢資料失敗:`, error);

    // 更新爬蟲記錄為失敗狀態
    if (scrapingLog) {
      await prisma.scrapingJobLog.update({
        where: { id: scrapingLog.id },
        data: {
          status: 'failed',
          endTime: new Date(),
          message: `爬取失敗: ${error instanceof Error ? error.message : String(error)}`
        }
      });
    }
  }
}

/**
 * 啟動所有爬蟲任務
 * @returns 啟動結果
 */
export function startAllScrapingTasks(): SchedulerResult {
  try {
    // 先停止所有正在運行的任務
    stopAllScrapingTasks();

    // 啟動所有任務
    let startedCount = 0;
    for (const jobName in scrapingJobs) {
      // 使用類型斷言來解決 TypeScript 的類型檢查問題
      const job = scrapingJobs[jobName] as any;
      if (!job.running) {
        job.start();
        startedCount++;
        console.log(`Started scraping job: ${jobName}`);
      }
    }

    return {
      success: true,
      message: `成功啟動 ${startedCount} 個趨勢爬蟲任務`
    };
  } catch (error) {
    console.error('Error starting scraping tasks:', error);
    return {
      success: false,
      message: `啟動趨勢爬蟲任務時發生錯誤: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 停止所有爬蟲任務
 * @returns 停止結果
 */
export function stopAllScrapingTasks(): SchedulerResult {
  try {
    let stoppedCount = 0;
    for (const jobName in scrapingJobs) {
      // 使用類型斷言來解決 TypeScript 的類型檢查問題
      const job = scrapingJobs[jobName] as any;
      if (job.running) {
        job.stop();
        stoppedCount++;
        console.log(`Stopped scraping job: ${jobName}`);
      }
    }

    return {
      success: true,
      message: `成功停止 ${stoppedCount} 個趨勢爬蟲任務`
    };
  } catch (error) {
    console.error('Error stopping scraping tasks:', error);
    return {
      success: false,
      message: `停止趨勢爬蟲任務時發生錯誤: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 手動執行每日趨勢爬蟲
 * @returns 執行結果
 */
export async function manualRunDailyTrending(): Promise<SchedulerResult> {
  try {
    // 只清空每日趨勢資料表
    await clearScrapingData('daily');
    // 執行爬蟲
    await scrapeTrending('daily');
    return {
      success: true,
      message: '每日趨勢爬蟲任務已完成'
    };
  } catch (error) {
    console.error('執行每日趨勢爬蟲失敗:', error);
    return {
      success: false,
      message: `每日趨勢爬蟲任務失敗: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 手動執行每週趨勢爬蟲
 * @returns 執行結果
 */
export async function manualRunWeeklyTrending(): Promise<SchedulerResult> {
  try {
    // 只清空每週趨勢資料表
    await clearScrapingData('weekly');
    // 執行爬蟲
    await scrapeTrending('weekly');
    return {
      success: true,
      message: '每週趨勢爬蟲任務已完成'
    };
  } catch (error) {
    console.error('執行每週趨勢爬蟲失敗:', error);
    return {
      success: false,
      message: `每週趨勢爬蟲任務失敗: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 手動執行每月熱門專案更新
 * @returns 執行結果
 */
export async function manualRunMonthlyTrending(): Promise<SchedulerResult> {
  try {
    // 只清空每月趨勢資料表
    await clearScrapingData('monthly');
    // 執行爬蟲
    await scrapeTrending('monthly');
    return {
      success: true,
      message: '每月熱門專案更新已完成'
    };
  } catch (error) {
    console.error('執行每月趨勢爬蟲失敗:', error);
    return {
      success: false,
      message: `每月熱門專案更新失敗: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 手動執行完整趨勢爬蟲
 * @returns 執行結果
 */
export async function manualRunComprehensiveScraping(): Promise<SchedulerResult> {
  try {
    console.log('=========================================');
    console.log('開始執行完整趨勢爬蟲...');
    console.log('=========================================');

    // 清空所有資料表
    await clearScrapingData('all');

    // 依序執行一般趨勢爬蟲（這裡不再需要清空資料表，因為已經在前面清空了所有資料表）
    console.log('=========================================');
    console.log('開始執行一般趨勢爬蟲...');
    console.log('=========================================');

    // 執行一般的每日趨勢爬蟲
    await scrapeTrending('daily');
    console.log('完成一般每日趨勢爬蟲');
    console.log('=========================================');

    // 執行一般的每週趨勢爬蟲
    await scrapeTrending('weekly');
    console.log('完成一般每週趨勢爬蟲');
    console.log('=========================================');

    // 執行一般的每月趨勢爬蟲
    await scrapeTrending('monthly');
    console.log('完成一般每月趨勢爬蟲');
    console.log('=========================================');

    // 執行各程式語言的趨勢爬取
    console.log('=========================================');
    console.log('開始執行各程式語言趨勢爬取...');
    console.log('=========================================');

    // 直接調用語言趨勢爬蟲函數
    await runLanguageTrendingScraping();

    // 確保資料寫入
    try {
      // 強制提交並刷新 - 使用 $queryRawUnsafe 而不是 $executeRaw
      await prisma.$queryRawUnsafe('PRAGMA wal_checkpoint(FULL)');
      console.log('資料庫寫入已刷新');
    } catch (e) {
      console.warn('資料庫刷新操作可能不支援，但不影響主要爬蟲操作', e);
    }

    // 檢查資料是否存在
    const dailyCount = await prisma.dailyRepository.count();
    const weeklyCount = await prisma.weeklyRepository.count();
    const monthlyCount = await prisma.monthlyRepository.count();

    console.log('=========================================');
    console.log('爬蟲結果統計:');
    console.log(`- 每日資料: ${dailyCount} 條記錄`);
    console.log(`- 每週資料: ${weeklyCount} 條記錄`);
    console.log(`- 每月資料: ${monthlyCount} 條記錄`);
    console.log('=========================================');

    return {
      success: true,
      message: `完整趨勢爬蟲任務已完成，包含一般趨勢和各程式語言趨勢。共 ${dailyCount + weeklyCount + monthlyCount} 條記錄。`
    };
  } catch (error) {
    console.error('執行完整趨勢爬蟲失敗:', error);
    return {
      success: false,
      message: `完整趨勢爬蟲任務失敗: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    // 確保資料庫連接被適當處理
    try {
      // 不要斷開主連接，但確保全部操作完成 - 使用 $queryRawUnsafe 而不是 $executeRaw
      await prisma.$queryRawUnsafe('PRAGMA optimize');
    } catch (e) {
      console.warn('資料庫最終優化可能不支援', e);
    }
  }
}

/**
 * 初始化爬蟲任務
 * 此函數應在服務器啟動時被調用
 */
export function initializeScrapingTasks(): void {
  console.log('Initializing trending scraping tasks...');
  startAllScrapingTasks();
}

// 確保在退出時關閉 Prisma 連接
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
