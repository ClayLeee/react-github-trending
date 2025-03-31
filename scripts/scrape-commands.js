#!/usr/bin/env node

/**
 * 通用的爬蟲命令腳本
 * 用法：node scrape-commands.js [命令]
 *
 * 支援的命令：
 * - daily: 執行每日趨勢爬蟲
 * - weekly: 執行每週趨勢爬蟲
 * - monthly: 執行每月趨勢爬蟲
 * - languages: 執行語言趨勢爬蟲
 * - comprehensive: 執行完整趨勢爬蟲
 */

const { spawnSync } = require('child_process');
const os = require('os');

// 判斷是否為 Windows 平台
const isWindows = os.platform() === 'win32';

// 獲取命令行參數
const command = process.argv[2];

if (!command) {
  console.error('錯誤：必須指定命令');
  console.log('用法：node scrape-commands.js [命令]');
  console.log('支援的命令：daily, weekly, monthly, languages, comprehensive');
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
      return spawnSync(cmd + '.cmd', args, { ...options, shell: true });
    }
  }

  // 非 Windows 平台直接執行
  return spawnSync(cmd, args, options);
}

// 命令對應的描述
const commandDescriptions = {
  'daily': '每日趨勢爬蟲',
  'weekly': '每週趨勢爬蟲',
  'monthly': '每月趨勢爬蟲',
  'languages': '語言趨勢爬蟲',
  'comprehensive': '完整趨勢爬蟲'
};

// 檢查命令是否有效
if (!Object.keys(commandDescriptions).includes(command)) {
  console.error(`錯誤：不支援的命令 "${command}"`);
  console.log('支援的命令：daily, weekly, monthly, languages, comprehensive');
  process.exit(1);
}

// 打印命令開始訊息
console.log(`執行爬蟲命令: ${commandDescriptions[command]} - ${new Date().toISOString()}`);

// 執行對應的命令
const result = executeCommand('npx', ['ts-node', '--project', 'scripts/tsconfig.json', 'scripts/scraper-cli.ts', command], { stdio: 'inherit' });

// 檢查執行結果
if (result.error) {
  console.error(`命令執行失敗:`, result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`命令執行失敗，退出代碼: ${result.status}`);
  process.exit(result.status);
}

console.log(`爬蟲命令執行完成 - ${new Date().toISOString()}`);
