#!/usr/bin/env ts-node
/**
 * 資料庫表初始化腳本
 *
 * 運行方式：
 * npm run init:db-tables
 *
 * 或者直接使用 ts-node：
 * ts-node scripts/init-db-tables.ts
 */

import { initializeDatabaseTables } from '../app/lib/db-init';

console.log('====== 資料庫表初始化工具 ======');
console.log('此工具將創建所有所需的資料表，包括：');
console.log('- 基本資料表：DailyRepository, WeeklyRepository, MonthlyRepository');
console.log('- 語言特定資料表：如 JavaDailyRepository, JavaWeeklyRepository 等');
console.log('==================================');

// 執行初始化
initializeDatabaseTables()
  .then(() => {
    console.log('資料庫表初始化成功完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('資料庫表初始化失敗:', error);
    process.exit(1);
  });
