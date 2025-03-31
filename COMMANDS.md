# GitHub Trending 專案指令說明

本檔案詳細說明了專案中的所有指令及其用途，方便開發和維護。

## 基本運行指令

| 指令 | 說明 |
|------|------|
| `pnpm dev` | 啟動開發環境服務器 |
| `pnpm build` | 構建生產環境版本 |
| `pnpm start` | 啟動生產環境服務器 |
| `pnpm lint` | 運行程式碼檢查 |
| `pnpm postinstall` | 安裝後自動生成 Prisma 客戶端 |

## 資料庫相關指令

### 資料庫基本操作

| 指令 | 說明 |
|------|------|
| `pnpm db [命令]` | 通用資料庫命令執行器，支援下列子命令:<br>• `reset`: 重置資料庫<br>• `init-schema`: 初始化資料庫結構<br>• `init-tables`: 初始化語言特定資料表<br>• `complete-init`: 完整初始化<br>• `studio`: 啟動 Prisma Studio |
| `pnpm db:studio` | 啟動 Prisma Studio 資料庫管理界面 |
| `pnpm db:migrate` | 執行 Prisma 遷移 |

### 資料庫管理工具

| 指令 | 說明 |
|------|------|
| `pnpm db:list-tables` | 列出所有資料表 (分類為一般趨勢、語言趨勢和其他資料表) |
| `pnpm db:check` | 檢查資料庫連接和狀態 |

### 資料庫重設與初始化

| 指令 | 說明 |
|------|------|
| `pnpm db:clean-reset` | 完全重置資料庫 (刪除檔案+重建所有表)，適用於修復嚴重結構問題 |
| `pnpm db:init-tables` | 初始化語言特定資料表 (Java, JavaScript 等語言的資料表) |

## 爬蟲相關指令

### 爬蟲操作

| 指令 | 說明 |
|------|------|
| `pnpm scrape [類型]` | 通用爬蟲命令執行器，支援下列類型:<br>• `daily`: 每日趨勢<br>• `weekly`: 每週趨勢<br>• `monthly`: 每月趨勢<br>• `languages`: 各程式語言趨勢<br>• `comprehensive`: 完整爬蟲<br>• `db-check`: 資料庫檢查 |
| `pnpm scrape:daily` | 爬取每日趨勢 |
| `pnpm scrape:weekly` | 爬取每週趨勢 |
| `pnpm scrape:monthly` | 爬取每月趨勢 |
| `pnpm scrape:languages` | 爬取各程式語言趨勢 |
| `pnpm scrape:comprehensive` | 執行完整爬蟲 (包含所有類型) |

### 定時任務

| 指令 | 說明 |
|------|------|
| `pnpm cron:run [任務]` | 通用定時任務執行器，支援下列任務:<br>• `daily`: 每日趨勢<br>• `weekly`: 每週趨勢<br>• `monthly`: 每月趨勢<br>• `languages`: 各程式語言趨勢<br>• `comprehensive`: 完整爬蟲 |
| `pnpm cron:daily` | 執行每日趨勢定時爬蟲任務 |
| `pnpm cron:weekly` | 執行每週趨勢定時爬蟲任務 |
| `pnpm cron:monthly` | 執行每月趨勢定時爬蟲任務 |
| `pnpm cron:languages` | 執行各語言趨勢定時爬蟲任務 |
| `pnpm cron:comprehensive` | 執行完整定時爬蟲任務 (包含所有類型) |

## 資料庫結構說明

專案中的資料表分為三大類：

1. **一般趨勢相關資料表**：
   - `DailyRepository`：每日趨勢資料表
   - `WeeklyRepository`：每週趨勢資料表
   - `MonthlyRepository`：每月趨勢資料表

2. **語言趨勢相關資料表**：
   - 每種語言分別有三個資料表，對應每日、每週和每月趨勢
   - 例如：`JavaScriptDailyRepository`、`JavaScriptWeeklyRepository`、`JavaScriptMonthlyRepository`
   - 支援的語言包括：JavaScript、TypeScript、Python、Java、C++、C#、Go等

3. **其他資料表**：
   - `ScrapingJobLog`：爬蟲任務日誌
   - `_prisma_migrations`：Prisma 遷移記錄
   - `sqlite_sequence`：SQLite 序列

## 常見使用情境

1. **首次設置專案**:
   ```bash
   pnpm install
   npx prisma migrate reset --force
   pnpm scrape:comprehensive
   pnpm dev
   ```

2. **重置資料庫**:
   - 標準重置: `npx prisma migrate reset --force`
   - 互動式完全重置: `pnpm db:clean-reset`

3. **執行爬蟲**:
   - 完整爬蟲: `pnpm scrape:comprehensive`
   - 特定爬蟲: `pnpm scrape:daily`

4. **查看資料庫**:
   - 使用 UI 介面: `pnpm db:studio`
   - 列出所有表: `pnpm db:list-tables`

5. **修復資料表結構問題**:
   ```bash
   pnpm db:clean-reset
   pnpm db:list-tables   # 驗證表是否正確創建
   pnpm scrape:comprehensive   # 重新填充資料
   ```

## 注意事項

- 所有 `db:clean-reset` 和 `npx prisma migrate reset` 操作會永久刪除資料庫資料，請謹慎使用
- 執行 `db:clean-reset` 前請確保關閉 Prisma Studio 及其他使用資料庫的程序
- 所有資料都由爬蟲獲取，沒有預設種子資料
- 定時任務只在生產環境自動運行，開發環境需要手動觸發
- 使用 `npx prisma migrate reset` 是快速重建整個資料庫結構的最簡單方式
