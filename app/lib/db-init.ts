import { PrismaClient } from '@prisma/client';
import { PROGRAMMING_LANGUAGES, LANGUAGE_URL_MAP } from './constants';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * 檢查資料庫檔案是否存在
 * @returns 資料庫檔案路徑
 */
function checkDatabaseFile(): string {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

  try {
    if (fs.existsSync(dbPath)) {
      console.log(`資料庫檔案存在: ${dbPath}`);
      return dbPath;
    } else {
      console.error(`錯誤: 找不到資料庫檔案: ${dbPath}`);
      console.error('請先執行 pnpm db:init 來初始化資料庫');
      throw new Error('找不到資料庫檔案');
    }
  } catch (error) {
    console.error('檢查資料庫檔案時發生錯誤:', error);
    throw error;
  }
}

/**
 * 獲取安全的資料表名稱（移除特殊字元並轉為駝峰命名）
 * @param language 程式語言名稱
 * @returns 安全的資料表名稱前綴
 */
export function getSafeTableName(language: string): string {
  // 特殊情況預先處理
  if (language === 'c%23' || language === 'csharp') {
    return 'CSharp';
  } else if (language === 'c++' || language === 'c%2B%2B') {
    return 'CPP';
  }

  // 清理語言名稱，處理特殊情況
  const mappedLanguage = LANGUAGE_URL_MAP[language] || language;

  // 轉換為 Pascal Case (首字母大寫)
  const safeName = mappedLanguage
    .replace(/[\s\+\-\.]/g, '_')
    .replace(/-/g, '_')
    .replace(/%\d+/g, '')  // 移除百分比編碼 (例如 %23)
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return safeName;
}

/**
 * 創建程式語言特定的資料表
 * @param language 程式語言名稱
 */
async function createLanguageSpecificTables(language: string) {
  try {
    const safeLanguageName = getSafeTableName(language);
    console.log(`處理語言: ${language} => ${safeLanguageName}`);

    // 建立每日資料表
    const dailyTableName = `${safeLanguageName}DailyRepository`;
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${dailyTableName}" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "${dailyTableName}_trendingDate_idx" ON "${dailyTableName}" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "${dailyTableName}_language_idx" ON "${dailyTableName}" ("language");
      `);
      console.log(`已建立或確認 ${dailyTableName} 資料表`);
    } catch (error) {
      console.error(`建立 ${dailyTableName} 資料表時發生錯誤:`, error);
      throw error;
    }

    // 建立每週資料表
    const weeklyTableName = `${safeLanguageName}WeeklyRepository`;
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${weeklyTableName}" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "${weeklyTableName}_trendingDate_idx" ON "${weeklyTableName}" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "${weeklyTableName}_language_idx" ON "${weeklyTableName}" ("language");
      `);
      console.log(`已建立或確認 ${weeklyTableName} 資料表`);
    } catch (error) {
      console.error(`建立 ${weeklyTableName} 資料表時發生錯誤:`, error);
      throw error;
    }

    // 建立每月資料表
    const monthlyTableName = `${safeLanguageName}MonthlyRepository`;
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${monthlyTableName}" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "${monthlyTableName}_trendingDate_idx" ON "${monthlyTableName}" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "${monthlyTableName}_language_idx" ON "${monthlyTableName}" ("language");
      `);
      console.log(`已建立或確認 ${monthlyTableName} 資料表`);
    } catch (error) {
      console.error(`建立 ${monthlyTableName} 資料表時發生錯誤:`, error);
      throw error;
    }

  } catch (error) {
    console.error(`為 ${language} 建立資料表時發生錯誤:`, error);
    throw error;
  }
}

/**
 * 確保一般的資料表存在
 */
async function ensureGeneralTablesExist() {
  try {
    // 確保 DailyRepository 表存在
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "DailyRepository" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "DailyRepository_trendingDate_idx" ON "DailyRepository" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "DailyRepository_language_idx" ON "DailyRepository" ("language");
      `);
      console.log('已建立或確認 DailyRepository 資料表');
    } catch (error) {
      console.error('建立 DailyRepository 資料表時發生錯誤:', error);
      throw error;
    }

    // 確保 WeeklyRepository 表存在
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "WeeklyRepository" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "WeeklyRepository_trendingDate_idx" ON "WeeklyRepository" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "WeeklyRepository_language_idx" ON "WeeklyRepository" ("language");
      `);
      console.log('已建立或確認 WeeklyRepository 資料表');
    } catch (error) {
      console.error('建立 WeeklyRepository 資料表時發生錯誤:', error);
      throw error;
    }

    // 確保 MonthlyRepository 表存在
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "MonthlyRepository" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          repoId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          language TEXT,
          stars INTEGER NOT NULL,
          forks INTEGER NOT NULL,
          currentStars INTEGER NOT NULL,
          trendingDate DATETIME NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL
        );
        CREATE INDEX IF NOT EXISTS "MonthlyRepository_trendingDate_idx" ON "MonthlyRepository" ("trendingDate");
        CREATE INDEX IF NOT EXISTS "MonthlyRepository_language_idx" ON "MonthlyRepository" ("language");
      `);
      console.log('已建立或確認 MonthlyRepository 資料表');
    } catch (error) {
      console.error('建立 MonthlyRepository 資料表時發生錯誤:', error);
      throw error;
    }
  } catch (error) {
    console.error('建立一般資料表時發生錯誤:', error);
    throw error;
  }
}

/**
 * 初始化所有資料表
 * 此函數應在應用程式啟動時被調用
 */
export async function initializeDatabaseTables(): Promise<void> {
  console.log('開始初始化資料庫表結構...');

  try {
    // 檢查資料庫檔案
    checkDatabaseFile();

    // 確保一般資料表存在
    await ensureGeneralTablesExist();

    // 為每種程式語言建立對應資料表
    console.log('開始建立各程式語言專用資料表...');
    for (const language of PROGRAMMING_LANGUAGES) {
      await createLanguageSpecificTables(language);
    }

    // 驗證資料表是否建立成功
    console.log('驗證資料表是否成功建立...');
    const tables = await prisma.$queryRaw<{name: string}[]>`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `;

    if (tables.length > 0) {
      console.log(`數據庫中共存在 ${tables.length} 個資料表`);

      const languageTables = tables.filter(t =>
        t.name.includes('Daily') ||
        t.name.includes('Weekly') ||
        t.name.includes('Monthly')
      );

      if (languageTables.length > 0) {
        console.log(`其中包含 ${languageTables.length} 個語言相關資料表`);
      } else {
        console.warn('警告：找不到語言相關資料表，初始化可能未完全成功');
      }
    } else {
      console.warn('警告：未找到任何資料表，初始化可能失敗');
    }

    console.log('資料庫表結構初始化完成');
  } catch (error) {
    console.error('初始化資料庫表結構時發生錯誤:', error);
    throw error;
  } finally {
    // 確保關閉 Prisma 連接
    await prisma.$disconnect();
  }
}

// 開發環境測試用
if (process.env.NODE_ENV === 'development' && process.env.INIT_DB_TABLES === 'true') {
  // 檢查是否需要初始化資料庫表格
  const shouldInitDb = async () => {
    try {
      // 檢查是否已有資料表存在
      const tables = await prisma.$queryRaw<{name: string}[]>`
        SELECT name FROM sqlite_master WHERE type='table' AND name='DailyRepository'
      `;

      // 如果 DailyRepository 表不存在，則需要初始化
      return tables.length === 0;
    } catch (error) {
      console.error('檢查資料表是否存在時發生錯誤:', error);
      // 出錯時預設執行初始化
      return true;
    }
  };

  // 只有在表格不存在時才初始化
  shouldInitDb().then(needsInit => {
    if (needsInit) {
      console.log('資料庫表格不存在，進行初始化...');
      initializeDatabaseTables()
        .then(() => console.log('手動初始化資料庫表完成'))
        .catch(e => console.error('手動初始化資料庫表失敗:', e));
    } else {
      console.log('資料庫表格已存在，跳過初始化');
    }
  });
}
