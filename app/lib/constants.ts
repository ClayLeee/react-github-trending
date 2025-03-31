/**
 * 應用程式常量配置檔
 * 集中存放所有共享的常量參數
 */

/**
 * 支持的程式語言列表
 * 用於語言趨勢頁面顯示和爬蟲
 * 注意：在 URL 中使用時，c++ 直接使用 c++，c# 使用 c%23
 */
export const PROGRAMMING_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c++',
  'c#',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'dart'
];

/**
 * GitHub URL 中使用的語言名稱映射
 * 某些語言在 URL 中有特殊格式
 */
export const LANGUAGE_URL_MAP: Record<string, string> = {
  'c#': 'c%23',  // 將 c# 映射為 c%23 (# 符號的 URL 編碼)
  'c++': 'c%2B%2B'  // 將 c++ 映射為 c%2B%2B (+ 符號的 URL 編碼)
};

/**
 * 語言顯示名稱映射
 * 用於轉換從URL中獲取的語言名稱到顯示名稱
 */
export const LANGUAGE_DISPLAY_MAP: Record<string, string> = {
  'c++': 'C++',
  'c#': 'C#',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart'
};

/**
 * 語言與資料表名稱映射
 * 用於轉換程式語言名稱到對應的資料表名稱前綴
 */
export const TABLE_NAME_MAP: Record<string, string> = {
  'c++': 'CPP',
  'c#': 'CSharp',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'Php',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart'
};

/**
 * 爬蟲 UserAgent 列表
 * 用於隨機化請求頭
 */
export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
];

/**
 * 爬蟲配置參數
 */
export const SCRAPER_CONFIG = {
  // 重試配置
  MAX_RETRIES: 3,
  INITIAL_DELAY: 2000,  // 首次重試前等待時間(ms)

  // 爬蟲間隔配置
  TASK_DELAY_MIN: 10000, // 任務之間的最小延遲(ms)
  TASK_DELAY_RANDOM: 5000, // 額外隨機延遲(ms)
  ERROR_DELAY: 15000,    // 錯誤後等待時間(ms)

  // 時間範圍
  TIME_RANGES: ['daily', 'weekly', 'monthly'] as const
};

/**
 * 語言卡片顏色配置
 */
export const LANGUAGE_COLORS: Record<string, { bg: string, darkBg: string, border: string }> = {
  'javascript': { bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-900/20', border: 'border-yellow-300/30' },
  'typescript': { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', border: 'border-blue-300/30' },
  'python': { bg: 'bg-sky-50', darkBg: 'dark:bg-sky-900/20', border: 'border-sky-300/30' },
  'java': { bg: 'bg-orange-50', darkBg: 'dark:bg-orange-900/20', border: 'border-orange-300/30' },
  'c++': { bg: 'bg-pink-50', darkBg: 'dark:bg-pink-900/20', border: 'border-pink-300/30' },
  'c#': { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/20', border: 'border-purple-300/30' },
  'go': { bg: 'bg-cyan-50', darkBg: 'dark:bg-cyan-900/20', border: 'border-cyan-300/30' },
  'rust': { bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', border: 'border-amber-300/30' },
  'ruby': { bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20', border: 'border-red-300/30' },
  'php': { bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900/20', border: 'border-indigo-300/30' },
  'swift': { bg: 'bg-orange-50', darkBg: 'dark:bg-orange-900/20', border: 'border-orange-300/30' },
  'kotlin': { bg: 'bg-violet-50', darkBg: 'dark:bg-violet-900/20', border: 'border-violet-300/30' },
  'dart': { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', border: 'border-blue-300/30' }
};
