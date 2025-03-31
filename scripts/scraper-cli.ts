/**
 * 爬蟲 CLI 工具
 * 此腳本提供統一的命令行介面，用於執行各種爬蟲任務
 * 所有任務都通過調用核心爬蟲庫直接執行，不再使用外部命令
 */

import {
  runLanguageTrendingScraping
} from '../app/lib/scraper';
import {
  manualRunDailyTrending,
  manualRunWeeklyTrending,
  manualRunMonthlyTrending,
  manualRunComprehensiveScraping
} from '../app/lib/scheduler';

async function main() {
  // 獲取命令行參數
  const args = process.argv.slice(2);
  const taskType = args[0];

  console.log(`開始執行任務: ${taskType}`);
  let result;

  try {
    switch (taskType) {
      case 'daily':
        result = await manualRunDailyTrending();
        break;
      case 'weekly':
        result = await manualRunWeeklyTrending();
        break;
      case 'monthly':
        result = await manualRunMonthlyTrending();
        break;
      case 'language':
      case 'languages':
        result = await runLanguageTrendingScraping();
        break;
      case 'comprehensive':
        result = await manualRunComprehensiveScraping();
        break;
      default:
        console.error('無效的任務類型。有效類型: daily, weekly, monthly, language, comprehensive');
        process.exit(1);
    }

    console.log(`任務執行結果: ${result.message}`);
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('執行任務時發生錯誤:', error);
    process.exit(1);
  }
}

main();
