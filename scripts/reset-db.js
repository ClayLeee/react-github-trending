#!/usr/bin/env node

/**
 * 完全重置資料庫腳本
 * 這個腳本將刪除現有的資料庫檔案並重新初始化
 *
 * 警告：執行此腳本將永久刪除所有資料！
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// 判斷是否為 Windows 平台
const isWindows = os.platform() === 'win32';

/**
 * 以跨平台方式執行命令
 */
function executeCommand(cmd, args, options = {}) {
  if (isWindows && ['npx', 'npm', 'pnpm'].includes(cmd)) {
    return spawnSync(cmd + '.cmd', args, { ...options, shell: true });
  }
  return spawnSync(cmd, args, options);
}

// 資料庫路徑
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const dbJournalPath = path.join(process.cwd(), 'prisma', 'dev.db-journal');

// 創建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('====== 資料庫完全重置工具 ======');
console.log('警告：此操作將永久刪除所有資料！');
console.log('==================================');

rl.question('確定要重置資料庫？所有數據將被刪除！(y/N): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('已取消操作');
    rl.close();
    return;
  }

  console.log('開始執行資料庫完全重置...');

  // 步驟 1: 關閉所有 Prisma 連接
  console.log('步驟 1: 嘗試關閉所有 Prisma 連接');

  // 步驟 2: 刪除資料庫檔案
  console.log('步驟 2: 刪除資料庫檔案');
  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log(`已刪除資料庫檔案: ${dbPath}`);
    } else {
      console.log(`資料庫檔案不存在: ${dbPath}`);
    }

    // 同時刪除 journal 檔案 (如果存在)
    if (fs.existsSync(dbJournalPath)) {
      fs.unlinkSync(dbJournalPath);
      console.log(`已刪除資料庫日誌檔案: ${dbJournalPath}`);
    }
  } catch (err) {
    console.error('刪除資料庫檔案時發生錯誤:', err);
    console.error('請確保沒有其他程序正在使用資料庫 (如 Prisma Studio)');
    rl.close();
    process.exit(1);
  }

  // 步驟 3: 執行 Prisma 遷移初始化
  console.log('步驟 3: 執行 Prisma 遷移初始化');
  const migrateResult = executeCommand('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], { stdio: 'inherit' });

  if (migrateResult.status !== 0) {
    console.error('執行 Prisma 遷移初始化失敗');
    rl.close();
    process.exit(1);
  }

  // 步驟 4: 初始化語言特定資料表
  console.log('步驟 4: 初始化語言特定資料表');
  const tablesResult = executeCommand('npx', ['ts-node', '--project', 'scripts/tsconfig.json', 'scripts/init-db-tables.ts'], { stdio: 'inherit' });

  if (tablesResult.status !== 0) {
    console.error('初始化語言特定資料表失敗');
    rl.close();
    process.exit(1);
  }

  console.log('==================================');
  console.log('✅ 資料庫完全重置成功！');
  console.log('現在可以使用 pnpm db:list-tables 查看所有資料表');
  console.log('請使用爬蟲獲取資料');
  rl.close();
});
