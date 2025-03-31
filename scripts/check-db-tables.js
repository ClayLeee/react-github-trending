#!/usr/bin/env node

/**
 * 檢查資料庫中所有存在的資料表
 * 這個腳本會直接查詢 SQLite 資料庫，列出所有資料表
 * 包括不在 Prisma schema 中定義的表
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

if (!fs.existsSync(dbPath)) {
  console.error(`錯誤：資料庫文件不存在: ${dbPath}`);
  process.exit(1);
}

console.log(`檢查資料庫: ${dbPath}`);
console.log('正在查詢所有資料表...');

// 使用 npx prisma 工具直接查詢
async function listTablesUsingPrisma() {
  try {
    // 使用臨時 JavaScript 檔案通過 Prisma 查詢表結構
    const tempScriptPath = path.join(__dirname, 'temp-list-tables.js');

    // 創建臨時腳本檔案
    fs.writeFileSync(tempScriptPath, `
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      async function listTables() {
        try {
          const tables = await prisma.$queryRaw\`
            SELECT name FROM sqlite_master
            WHERE type='table'
            ORDER BY name
          \`;

          console.log('\\n資料庫中的所有資料表:');
          console.log('======================');

          tables.forEach((table, index) => {
            console.log(\`\${index + 1}. \${table.name}\`);
          });

          console.log('\\n總共找到 ' + tables.length + ' 個資料表');

          // 分類資料表
          // 1. 一般趨勢相關資料表
          const generalTrendTables = tables.filter(t =>
            t.name === 'DailyRepository' ||
            t.name === 'WeeklyRepository' ||
            t.name === 'MonthlyRepository'
          );

          // 2. 語言趨勢相關資料表
          const languageTrendTables = tables.filter(t =>
            (t.name.includes('Daily') ||
             t.name.includes('Weekly') ||
             t.name.includes('Monthly')) &&
            !(t.name === 'DailyRepository' ||
              t.name === 'WeeklyRepository' ||
              t.name === 'MonthlyRepository')
          );

          // 3. 其他資料表
          const otherTables = tables.filter(t =>
            !(t.name === 'DailyRepository' ||
              t.name === 'WeeklyRepository' ||
              t.name === 'MonthlyRepository') &&
            !(t.name.includes('Daily') ||
              t.name.includes('Weekly') ||
              t.name.includes('Monthly'))
          );

          // 印出一般趨勢相關資料表
          if (generalTrendTables.length > 0) {
            console.log('\\n一般趨勢相關資料表:');
            console.log('======================');
            generalTrendTables.forEach((table, index) => {
              console.log(\`\${index + 1}. \${table.name}\`);
            });
          } else {
            console.log('\\n未找到一般趨勢相關資料表!');
          }

          // 印出語言趨勢相關資料表
          if (languageTrendTables.length > 0) {
            console.log('\\n語言趨勢相關資料表:');
            console.log('======================');
            languageTrendTables.forEach((table, index) => {
              console.log(\`\${index + 1}. \${table.name}\`);
            });
          } else {
            console.log('\\n未找到語言趨勢相關資料表!');
          }

          // 印出其他資料表
          if (otherTables.length > 0) {
            console.log('\\n其他資料表:');
            console.log('======================');
            otherTables.forEach((table, index) => {
              console.log(\`\${index + 1}. \${table.name}\`);
            });
          }
        } catch (err) {
          console.error('查詢資料表失敗:', err);
          process.exit(1);
        } finally {
          await prisma.$disconnect();
        }
      }

      listTables();
    `);

    // 執行臨時腳本
    const result = executeCommand('node', [tempScriptPath], { stdio: 'inherit' });

    // 刪除臨時腳本
    try {
      fs.unlinkSync(tempScriptPath);
    } catch (err) {
      // 忽略刪除錯誤
    }

    if (result.status !== 0) {
      console.error('執行 Prisma 查詢失敗');
      process.exit(1);
    }
  } catch (err) {
    console.error('執行查詢失敗:', err);
    process.exit(1);
  }
}

// 執行查詢
listTablesUsingPrisma();
