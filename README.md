# GitHub Trending 追蹤器

智能追蹤、分析及呈現 GitHub 熱門專案的工具，幫助開發者發現優質的開源技術和最新趨勢。

## 功能特點

- 🔍 智能爬取 GitHub 上每日、每週與每月的熱門專案
- 📊 支持每日、每週和每月的趨勢數據追蹤與分析
- 🏷️ 按照程式語言分類瀏覽熱門專案
- 📚 保存完整歷史數據，支持時間範圍查詢
- 📈 數據視覺化展示，一目了然技術趨勢變化
- 📱 響應式設計，完美支持桌面和移動裝置
- 🌓 支持明亮/暗黑模式，保護您的眼睛
- 🔄 系統狀態監控，了解爬蟲和資料庫運行情況

## 頁面導覽

- **每日趨勢** - 展示每日熱門專案
- **每週趨勢** - 展示每週熱門專案
- **每月趨勢** - 展示每月熱門專案
- **語言趨勢** - 按程式語言分類查看熱門專案
- **儀表板** - 整體數據概覽與統計
- **系統監控** - 查看系統狀態和爬蟲運行情況

## 技術棧

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, ECharts
- **後端**: Next.js API Routes, Server Components, Node.js
- **資料庫**: SQLite, Prisma ORM
- **爬蟲**: Axios, Cheerio, axios-retry, node-html-parser
- **排程**: node-cron, Cron
- **UI/UX**: Radix UI, Embla Carousel, Lucide React, Tailwind Merge
- **部署**: Vercel 或自託管服務器
- **分析**: Vercel Analytics, Speed Insights

## 快速開始

### 環境要求

- Node.js 18+
- pnpm (推薦) 或 npm

### 安裝步驟

1. 克隆本倉庫
   ```bash
   git clone https://github.com/yourusername/github-trending.git
   cd github-trending
   ```

2. 安裝依賴
   ```bash
   pnpm install
   ```

3. 配置環境變數
   - 複製 `.env.example` 為 `.env` (如果存在的話)
   - 根據需要調整設定

4. 初始化資料庫
   ```bash
   npx prisma migrate reset --force
   ```

5. 啟動開發服務器
   ```bash
   pnpm dev
   ```

6. 訪問 [http://localhost:3000](http://localhost:3000)

## 資料爬取機制

系統採用智能爬取機制，確保獲取足夠的專案數據：

- **每日/每週/每月趨勢**: 爬取 GitHub 上最熱門的專案
- **按語言分類趨勢**: 支持各種主流程式語言的專項趨勢
- **自動重試**: 使用 axios-retry 確保穩定的數據獲取
- **定時執行**: 通過 node-cron 或 Vercel Cron Jobs 定時爬取
- **手動觸發**: 通過 API 端點手動觸發爬取過程

### 爬取指令

```bash
# 通用爬蟲命令執行器
pnpm scrape [類型]  # 支援 daily, weekly, monthly, languages, comprehensive

# 爬取每日趨勢專案
pnpm scrape:daily

# 爬取每週趨勢專案
pnpm scrape:weekly

# 爬取每月趨勢專案
pnpm scrape:monthly

# 爬取各程式語言趨勢
pnpm scrape:languages

# 執行完整爬蟲 (包含所有類型)
pnpm scrape:comprehensive
```

## 資料庫操作

```bash
# 通用資料庫命令
pnpm db [命令]  # 支援 reset, init-schema, init-tables, complete-init, studio

# 啟動 Prisma Studio 瀏覽數據
pnpm db:studio

# 重置資料庫
npx prisma migrate reset --force

# 執行 Prisma 遷移
pnpm db:migrate

# 完全重置資料庫 (刪除檔案+重建所有表)
pnpm db:clean-reset

# 初始化語言特定資料表
pnpm db:init-tables

# 列出所有資料表
pnpm db:list-tables
```

## 定時任務

```bash
# 通用定時任務執行器
pnpm cron:run [任務]  # 支援 daily, weekly, monthly, languages, comprehensive

# 執行每日趨勢定時爬蟲任務
pnpm cron:daily

# 執行每週趨勢定時爬蟲任務
pnpm cron:weekly

# 執行每月趨勢定時爬蟲任務
pnpm cron:monthly

# 執行各語言趨勢定時爬蟲任務
pnpm cron:languages

# 執行完整定時爬蟲任務
pnpm cron:comprehensive
```

## 資料庫結構說明

專案中的資料表分為三大類：

1. **一般趨勢相關資料表**：
   - `DailyRepository`：每日趨勢資料表
   - `WeeklyRepository`：每週趨勢資料表
   - `MonthlyRepository`：每月趨勢資料表

2. **語言趨勢相關資料表**：
   - 每種語言分別有三個資料表，對應每日、每週和每月趨勢
   - 例如：`JavaScriptDailyRepository`、`JavaScriptWeeklyRepository`、`JavaScriptMonthlyRepository`

3. **其他資料表**：
   - `ScrapingJobLog`：爬蟲任務日誌

## 用戶界面特色

- **響應式設計**: 自適應各種裝置尺寸
- **主題切換**: 支持明亮/暗黑模式
- **資料表格**: 高效展示專案數據，支持排序和篩選
- **語言篩選**: 按照編程語言篩選專案
- **趨勢圖表**: 視覺化展示熱門語言和專案趨勢
- **輪播功能**: 自動展示熱門專案
- **卡片佈局**: 簡潔展示專案資訊
