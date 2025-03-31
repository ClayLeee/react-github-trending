#!/usr/bin/env node

/**
 * 通用的資料庫命令腳本
 * 用法：node db-commands.js [命令]
 *
 * 支援的命令：
 * - reset: 重置資料庫並填充種子數據
 * - init-schema: 初始化資料庫結構並填充種子數據
 * - init-tables: 初始化各語言的資料表
 * - complete-init: 完整初始化（包括結構和所有資料表）
 * - studio: 啟動 Prisma Studio
 */

const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');

// 判斷是否為 Windows 平台
const isWindows = os.platform() === 'win32';

// 獲取命令行參數
const command = process.argv[2];

if (!command) {
  console.error('錯誤：必須指定命令');
  console.log('用法：node db-commands.js [命令]');
  console.log('支援的命令：reset, init-schema, init-tables, complete-init, studio');
  process.exit(1);
}

/**
 * 以跨平台方式執行命令
 * @param {string} cmd 主命令
 * @param {string[]} args 命令參數
 * @param {object} options 執行選項
 * @returns {object} 執行結果
 */
function executeCommand(cmd, args, options = {}) {
  // Windows 特殊處理
  if (isWindows) {
    // 對於 npx, npm, pnpm 等命令在 Windows 上需要加上 .cmd 後綴
    if (['npx', 'npm', 'pnpm'].includes(cmd)) {
      // 使用 cross-spawn 處理 Windows 上的命令
      return spawnSync(cmd + '.cmd', args, { ...options, shell: true });
    }
  }

  // 非 Windows 平台直接執行
  return spawnSync(cmd, args, options);
}

// 命令對應的描述與執行函數
const commandActions = {
  'reset': {
    description: '重置資料庫',
    execute: () => {
      console.log('開始重置資料庫...');
      const resetResult = executeCommand('npx', ['prisma', 'migrate', 'reset', '--force'], { stdio: 'inherit' });
      if (resetResult.status !== 0) return resetResult;

      console.log('資料庫已重置，請使用爬蟲獲取資料。');
      return { status: 0 };
    }
  },
  'init-schema': {
    description: '初始化資料庫結構',
    execute: () => {
      console.log('開始初始化資料庫結構...');
      const migrateResult = executeCommand('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], { stdio: 'inherit' });
      if (migrateResult.status !== 0) return migrateResult;

      console.log('資料庫結構已初始化，請使用爬蟲獲取資料。');
      return { status: 0 };
    }
  },
  'init-tables': {
    description: '初始化各語言的資料表',
    execute: () => {
      console.log('開始初始化各語言資料表...');
      return executeCommand('npx', ['ts-node', '--project', 'scripts/tsconfig.json', 'scripts/init-db-tables.ts'], { stdio: 'inherit' });
    }
  },
  'complete-init': {
    description: '完整初始化（包括結構和所有資料表）',
    execute: () => {
      console.log('開始完整初始化資料庫...');

      console.log('步驟 1: 初始化資料庫結構');
      const schemaResult = executeCommand('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], { stdio: 'inherit' });
      if (schemaResult.status !== 0) return schemaResult;

      console.log('步驟 2: 初始化各語言資料表');
      return executeCommand('npx', ['ts-node', '--project', 'scripts/tsconfig.json', 'scripts/init-db-tables.ts'], { stdio: 'inherit' });
    }
  },
  'studio': {
    description: '啟動 Prisma Studio',
    execute: () => {
      console.log('啟動 Prisma Studio...');
      return executeCommand('npx', ['prisma', 'studio'], { stdio: 'inherit' });
    }
  }
};

// 檢查命令是否有效
if (!Object.keys(commandActions).includes(command)) {
  console.error(`錯誤：不支援的命令 "${command}"`);
  console.log('支援的命令：reset, init-schema, init-tables, complete-init, studio');
  process.exit(1);
}

// 打印命令開始訊息
console.log(`執行資料庫命令: ${commandActions[command].description} - ${new Date().toISOString()}`);

// 執行對應的命令
const result = commandActions[command].execute();

// 檢查執行結果
if (result && result.error) {
  console.error(`命令執行失敗:`, result.error);
  process.exit(1);
}

if (result && result.status !== 0) {
  console.error(`命令執行失敗，退出代碼: ${result.status}`);
  process.exit(result.status);
}

console.log(`資料庫命令執行完成 - ${new Date().toISOString()}`);
