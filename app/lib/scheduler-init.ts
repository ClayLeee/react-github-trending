// scheduler-init.ts
import { initializeScrapingTasks } from './scheduler';
import { initializeDatabaseTables } from './db-init';

let isInitialized = false;

/**
 * 這個文件用於在應用程式啟動時初始化排程任務
 * 它被包含在 `app/layout.tsx` 中，以確保在伺服器端渲染期間運行
 */

/**
 * 初始化調度器
 * 這會啟動所有定義的排程任務，如爬蟲任務等
 * 注意：資料庫表結構初始化應通過腳本或API單獨執行，不再在網頁載入時自動執行
 */
export async function initializeScheduler() {
  if (typeof window !== 'undefined') {
    // 確保只在伺服器端運行
    return;
  }

  if (isInitialized) {
    console.log('Scheduler already initialized.');
    return;
  }

  try {
    // 不再自動初始化資料庫表結構
    // console.log('Initializing database tables...');
    // await initializeDatabaseTables();
    // console.log('Database tables initialized successfully');

    if (process.env.NODE_ENV === 'development') {
      // 開發環境不自動執行爬蟲任務
      console.log('Development environment detected. Scraping tasks will NOT be initialized automatically.');
      console.log('Use API endpoints or CLI commands to manually run scraping tasks.');
      isInitialized = true;
      return;
    }

    // 初始化爬蟲任務（只在生產環境執行）
    initializeScrapingTasks();
    console.log('Successfully initialized scraping scheduler tasks in production environment');
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize scheduler:', error);
  }
}
