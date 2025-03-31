import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient, Prisma } from '@prisma/client';
import axiosRetry from 'axios-retry';
import crypto from 'crypto';
import {
  PROGRAMMING_LANGUAGES,
  USER_AGENTS,
  LANGUAGE_URL_MAP,
  SCRAPER_CONFIG
} from './constants';
import { getSafeTableName } from './db-init';

const prisma = new PrismaClient();

// 配置Axios重試機制
axiosRetry(axios, {
  retries: 3, // 最多重試3次
  retryDelay: (retryCount: number) => {
    return retryCount * 2000; // 重試延遲時間: 2秒, 4秒, 6秒
  },
  retryCondition: (error: any) => {
    // 只在網絡錯誤或超時時重試
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.code === 'ECONNABORTED';
  }
});

// 獲取隨機的UserAgent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// 添加延時函數
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type TimeRange = 'daily' | 'weekly' | 'monthly';

interface ScrapedRepository {
  name: string;
  owner: string;
  repoId: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  currentStars: number;
}

// 使用常量檔中定義的程式語言列表，並應用 URL 轉換
export const POPULAR_LANGUAGES = PROGRAMMING_LANGUAGES.map(lang => {
  // 檢查是否存在於 URL 映射中
  if (LANGUAGE_URL_MAP[lang]) {
    return LANGUAGE_URL_MAP[lang];
  }
  // 對於沒有特殊映射的語言，直接使用原名稱
  return lang;
});

/**
 * 抓取 GitHub Trending 頁面的專案資料
 * @param timeRange - 抓取時間範圍：'daily'（每日）或 'weekly'（每週）或 'monthly'（每月）
 * @param keyword - 可選的語言篩選條件
 * @returns 抓取到的儲存庫列表
 */
export async function scrapeTrendingRepositories(
  timeRange: TimeRange,
  keyword: string | null = null
): Promise<ScrapedRepository[]> {
  // 構建 GitHub Trending URL
  let url = 'https://github.com/trending';

  // 添加語言篩選
  if (keyword) {
    // 特殊處理預先編碼的語言名稱，避免二次編碼
    const languageParam = keyword.includes('%') ? keyword : encodeURIComponent(keyword);
    url = `${url}/${languageParam}`;
  }

  // 添加時間範圍參數
  url += url.includes('?') ? '&' : '?';
  url += `since=${timeRange}`;

  console.log(`抓取 URL: ${url}`);

  // 指數退避重試邏輯
  let repositories: ScrapedRepository[] = [];
  let retries = 0;
  const maxRetries = SCRAPER_CONFIG.MAX_RETRIES;
  const initialDelay = SCRAPER_CONFIG.INITIAL_DELAY;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const html = await response.text();
      // 解析 HTML 內容獲取儲存庫列表
      repositories = parseGitHubTrendingHTML(html, timeRange);
      console.log(`抓取到 ${repositories.length} 個儲存庫`);
      break;
    } catch (error) {
      console.error(`抓取嘗試 ${retries + 1}/${maxRetries} 失敗:`, error);
      retries++;

      if (retries === maxRetries) {
        console.error('達到最大重試次數，放棄抓取');
        return [];
      }

      // 指數退避延遲
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`等待 ${delay}ms 後再次嘗試...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return repositories;
}

/**
 * 解析 GitHub Trending 頁面 HTML
 * @param html GitHub Trending 頁面的 HTML 內容
 * @param timeRange 時間範圍：'daily'、'weekly' 或 'monthly'
 * @returns 解析出的儲存庫列表
 */
function parseGitHubTrendingHTML(html: string, timeRange: TimeRange): ScrapedRepository[] {
  const $ = cheerio.load(html);
  const repositories: ScrapedRepository[] = [];

  // 爬取每個項目資料
  const repoItems = $('article.Box-row');
  console.log(`找到 ${repoItems.length} 個儲存庫項目`);

  repoItems.each((_, element) => {
    try {
      // 獲取儲存庫名稱和擁有者
      const titleElement = $(element).find('h2.h3.lh-condensed a');
      const fullRepoName = titleElement.text().trim();

      // 嘗試從文本解析
      let owner = '';
      let name = '';
      let repoId = '';

      // 首先嘗試從文本中分割
      const parts = fullRepoName.split('/').map(part => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        owner = parts[0];
        name = parts[1];
        repoId = `${owner}/${name}`;
      } else {
        // 如果文本分割失敗，嘗試從 href 屬性中獲取
        const href = titleElement.attr('href') || '';
        if (href && href.startsWith('/')) {
          const hrefParts = href.substring(1).split('/');
          if (hrefParts.length >= 2) {
            owner = hrefParts[0];
            name = hrefParts[1];
            repoId = `${owner}/${name}`;
          } else {
            console.warn(`無法從 href 解析儲存庫: ${href}`);
            return;
          }
        } else {
          console.warn(`無法解析儲存庫名稱: ${fullRepoName}`);
          return;
        }
      }

      const url = `https://github.com/${owner}/${name}`;

      // 獲取儲存庫描述
      const description = $(element).find('p').text().trim() || null;

      // 獲取程式語言
      const languageElement = $(element).find('[itemprop="programmingLanguage"]');
      const language = languageElement.length ? languageElement.text().trim() : null;

      // 獲取總星星數 - 更直接且高效的方法
      let stars = 0;

      // 方法1: 尋找所有鏈接元素
      const links = $(element).find('a');

      // 首先尋找標準的星星鏈接
      for (let i = 0; i < links.length; i++) {
        const link = links.eq(i);
        const href = link.attr('href') || '';

        // 檢查是否是星星鏈接
        if (href.includes('/stargazers')) {
          // 獲取文本並清理
          let text = link.text().trim();
          if (text) {
            stars = parseStarCount(text);
            // 如果獲取到星星數，立即退出
            if (stars > 0) break;
          }
        }
      }

      // 方法2: 如果上述方法沒有找到，直接查找帶有星星圖標的元素
      if (stars === 0) {
        const starElements = $(element).find('svg[aria-label="star"]').parent();
        if (starElements.length) {
          const text = starElements.first().text().trim();
          stars = parseStarCount(text);
        }
      }

      // 方法3: 使用更通用的選擇器 - 這是最後的嘗試
      if (stars === 0) {
        // 獲取卡片中所有數字文本
        const numericTexts = $(element).find('*').filter(function() {
          const text = $(this).text().trim();
          return /^\s*[\d,]+(k|m)?\s*$/.test(text) &&
                 !$(this).closest('a[href*="forks"]').length &&
                 !text.includes('today') &&
                 !text.includes('week') &&
                 !text.includes('month');
        });

        // 如果找到多個數字，第一個通常是星星數
        if (numericTexts.length > 0) {
          stars = parseStarCount(numericTexts.first().text());
        }
      }

      // 獲取分叉數
      let forks = 0;

      // 尋找分叉鏈接
      for (let i = 0; i < links.length; i++) {
        const link = links.eq(i);
        const href = link.attr('href') || '';

        if (href.includes('/forks')) {
          const text = link.text().trim();
          if (text) {
            forks = parseStarCount(text);
            if (forks > 0) break;
          }
        }
      }

      // 備用方法：查找帶有叉圖標的元素
      if (forks === 0) {
        const forkElements = $(element).find('svg[aria-label="fork"]').parent();
        if (forkElements.length) {
          const text = forkElements.first().text().trim();
          forks = parseStarCount(text);
        }
      }

      // 獲取當前時段的增加星星數
      let currentStars = 0;

      // 嘗試多種可能的選擇器，以適應不同版本的 GitHub UI
      let starsToday = $(element).find('span.d-inline-block.float-sm-right').filter(function() {
        const text = $(this).text().trim().toLowerCase();
        return text.includes('stars today') || text.includes('stars this week') ||
               text.includes('stars this month') || text.includes('star today') ||
               text.includes('star this week') || text.includes('star this month');
      });

      // 備用選擇器 (如果上面的選擇器沒有結果)
      if (starsToday.length === 0) {
        starsToday = $(element).find('div:contains("stars today"), div:contains("stars this week"), div:contains("stars this month"), div:contains("star today"), div:contains("star this week"), div:contains("star this month")').last();
      }

      // 另一個備用選擇器
      if (starsToday.length === 0) {
        starsToday = $(element).find('span:contains("stars today"), span:contains("stars this week"), span:contains("stars this month"), span:contains("star today"), span:contains("star this week"), span:contains("star this month")');
      }

      // 新增一個更通用的選擇器方法，嘗試找到可能的星星增長元素
      if (starsToday.length === 0) {
        // 嘗試查找描述星星增長的元素，這些元素通常位於項目列表的特定位置
        const potentialStarElements = $(element).find('span.d-inline-block, div.f6.color-fg-muted.mt-2 span, div.f6.color-fg-muted.mt-2');
        potentialStarElements.each(function() {
          const text = $(this).text().trim();
          // 檢查文本是否可能包含星星增長信息（數字後跟可能的文字）
          if (/\d+,?\d*\s+stars?/i.test(text) || /\d+,?\d*\s+stars?\s+this/i.test(text)) {
            starsToday = $(this);
            return false; // 退出循環
          }
        });
      }

      // 新增更通用的匹配方式：查找任何包含星星數量和時間段的元素
      if (starsToday.length === 0) {
        $(element).find('*').each(function() {
          const text = $(this).text().trim();
          if ((/\d+,?\d*\s+stars?\s+today/i.test(text) ||
               /\d+,?\d*\s+stars?\s+this\s+week/i.test(text) ||
               /\d+,?\d*\s+stars?\s+this\s+month/i.test(text)) &&
              !/stargazers/i.test($(this).attr('href') || '')) {
            starsToday = $(this);
            return false; // 退出循環
          }
        });
      }

      if (starsToday.length) {
        const starText = starsToday.text().trim();
        // 使用正則表達式提取數字部分，支援多種格式
        const starsMatch = starText.match(/([0-9,]+)\s+stars?/i) ||
                           starText.match(/([0-9,]+)\s+stars?\s+/i) ||
                           starText.match(/([0-9,]+)\s+stars?\s+this\s+month/i);
        if (starsMatch && starsMatch[1]) {
          currentStars = parseInt(starsMatch[1].replace(/,/g, '')) || 0;
        }
      }

      // 如果所有方法都失敗，嘗試從元素的相鄰文本中查找
      if (currentStars === 0) {
        // 獲取元素的所有文本
        const allText = $(element).text();
        // 使用正則表達式查找包含 "stars today" 等字樣的部分
        const todayMatch = allText.match(/(\d+,?\d*)\s+stars?\s+today/i);
        const weekMatch = allText.match(/(\d+,?\d*)\s+stars?\s+this\s+week/i);
        const monthMatch = allText.match(/(\d+,?\d*)\s+stars?\s+this\s+month/i);

        const match = todayMatch || weekMatch || monthMatch;
        if (match && match[1]) {
          currentStars = parseInt(match[1].replace(/,/g, '')) || 0;
        }
      }

      repositories.push({
        name,
        owner,
        repoId,
        description,
        url,
        language,
        stars,
        forks,
        currentStars
      });

      // 調試輸出，顯示爬取到的資料
      console.log(`爬取成功: ${owner}/${name}, 星星: ${stars}, 分叉: ${forks}, 本期增加: ${currentStars}`);
    } catch (err) {
      console.error(`解析儲存庫項目時發生錯誤:`, err);
    }
  });

  console.log(`成功解析 ${repositories.length} 個儲存庫`);

  // 依當前時段新增星星數進行排序
  repositories.sort((a, b) => (b.currentStars - a.currentStars));

  return repositories;
}

/**
 * 將星數字符串解析為數字
 * 處理格式如 "1.2k" 或 "45.6k" 的字符串
 */
function parseStarCount(starText: string): number {
  if (!starText) return 0;

  // 清理輸入文本，移除所有空白字符
  const text = starText.trim();
  if (!text) return 0;

  try {
    // 首先嘗試提取數字部分
    const numericPart = text.match(/[\d,.]+/);
    if (!numericPart) return 0;

    const cleanedText = numericPart[0].replace(/,/g, '');

    // 處理縮寫形式的星標數量
    if (text.toLowerCase().includes('k')) {
      return Math.round(parseFloat(cleanedText) * 1000);
    } else if (text.toLowerCase().includes('m')) {
      return Math.round(parseFloat(cleanedText) * 1000000);
    } else {
      // 直接解析數字
      return parseInt(cleanedText, 10) || 0;
    }
  } catch (error) {
    console.error(`解析星標數量失敗: ${starText}`, error);
    return 0;
  }
}

/**
 * 保存爬取到的趨勢儲存庫到資料庫
 * @param repositories 爬取到的儲存庫列表
 * @param timeRange 時間範圍：'daily'、'weekly' 或 'monthly'
 * @param language 可選的語言名稱，用於區分一般趨勢和語言特定趨勢
 */
export async function saveTrendingRepositories(
  repositories: ScrapedRepository[],
  timeRange: TimeRange,
  language: string | null = null
) {
  try {
    if (repositories.length === 0) {
      console.log('沒有資料需要保存到資料庫');
      return;
    }

    console.log(`開始保存 ${repositories.length} 個${language ? ` ${language}` : ''} ${timeRange} 趨勢儲存庫到資料庫...`);

    const today = new Date();
    let successCount = 0;
    let errorCount = 0;
    let createdCount = 0;

    // 根據時間範圍和語言決定表名
    let tableName: string;
    let isLanguageSpecific = false;

    if (language) {
      // 使用 db-init.ts 中的 getSafeTableName 函數來確保表名一致性
      const safeLanguageName = getSafeTableName(language);

      tableName = `${safeLanguageName}${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}Repository`;
      isLanguageSpecific = true;

      // 記錄轉換後的表名
      console.log(`語言 ${language} 對應到資料表 ${tableName}`);
    } else {
      // 一般趨勢的表名
      tableName = `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}Repository`;
    }

    // 不再嘗試清空資料表，直接覆蓋舊數據
    // 系統設計是完全替換之前的資料，所以不需要清空操作

    // 保存到對應的趨勢表
    for (const repo of repositories) {
      try {
        if (isLanguageSpecific) {
          // 語言特定資料表使用更安全的查詢方式
          const description = repo.description?.replace(/'/g, "''") || null;

          try {
            // 使用 REPLACE INTO 代替 INSERT INTO
            // REPLACE INTO 會自動刪除可能衝突的舊記錄，然後插入新記錄
            // 注意：這需要表格有主鍵或唯一約束
            await prisma.$queryRawUnsafe(`
              REPLACE INTO "${tableName}" (
                "id", "owner", "name", "url", "description", "stars", "currentStars", "forks", "scrapedAt", "createdAt", "updatedAt"
              ) VALUES (
                '${crypto.randomUUID()}',
                '${repo.owner}',
                '${repo.name}',
                '${repo.url}',
                ${description ? `'${description}'` : 'NULL'},
                ${repo.stars},
                ${repo.currentStars},
                ${repo.forks},
                '${today.toISOString()}',
                '${new Date().toISOString()}',
                '${new Date().toISOString()}'
              )
            `);
          } catch (insertError) {
            console.error(`使用 $queryRawUnsafe 插入數據到 ${tableName} 失敗:`, insertError);

            // 如果 REPLACE INTO 失敗，嘗試標準的 INSERT INTO
            try {
              // 使用 $queryRawUnsafe 代替 $executeRaw
              await prisma.$queryRawUnsafe(`
                INSERT INTO "${tableName}" (
                  "id", "owner", "name", "url", "description", "stars", "currentStars", "forks", "scrapedAt", "createdAt", "updatedAt"
                ) VALUES (
                  '${crypto.randomUUID()}',
                  '${repo.owner}',
                  '${repo.name}',
                  '${repo.url}',
                  ${repo.description ? `'${repo.description.replace(/'/g, "''")}'` : 'NULL'},
                  ${repo.stars},
                  ${repo.currentStars},
                  ${repo.forks},
                  '${today.toISOString()}',
                  '${new Date().toISOString()}',
                  '${new Date().toISOString()}'
                )
              `);
            } catch (err) {
              // 如果兩種方法都失敗，記錄錯誤但繼續處理
              console.error(`兩種方法都無法插入數據到 ${tableName}:`, err);
              throw err; // 重新拋出錯誤以便在外層捕獲
            }
          }
        } else {
          // 對於標準資料表，使用 Prisma 的標準 API
          // 由於我們不再清空表格，使用 upsert 確保數據更新而不是重複
          if (timeRange === 'daily') {
            await prisma.dailyRepository.upsert({
              where: { repoId: repo.repoId },
              update: {
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                updatedAt: new Date()
              },
              create: {
                repoId: repo.repoId,
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          } else if (timeRange === 'weekly') {
            await prisma.weeklyRepository.upsert({
              where: { repoId: repo.repoId },
              update: {
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                updatedAt: new Date()
              },
              create: {
                repoId: repo.repoId,
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          } else if (timeRange === 'monthly') {
            await prisma.monthlyRepository.upsert({
              where: { repoId: repo.repoId },
              update: {
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                updatedAt: new Date()
              },
              create: {
                repoId: repo.repoId,
                name: repo.name,
                owner: repo.owner,
                description: repo.description,
                url: repo.url,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                currentStars: repo.currentStars,
                trendingDate: today,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          }
        }
        successCount++;
        createdCount++;
      } catch (error) {
        console.error(`保存儲存庫 ${repo.owner}/${repo.name} 到 ${tableName} 表時發生錯誤:`, error);
        errorCount++;
      }
    }

    console.log(`資料庫操作統計: ${successCount} 成功 (${createdCount} 新增/更新), ${errorCount} 錯誤`);
    console.log(`成功保存 ${repositories.length} 個${language ? ` ${language}` : ''} ${timeRange} 趨勢儲存庫`);
  } catch (error) {
    console.error(`保存趨勢儲存庫時發生錯誤:`, error);
    throw error;
  }
}

/**
 * 執行爬蟲任務
 * @param timeRange - 時間範圍：'daily' 或 'weekly'
 * @param keyword - 可選的語言篩選條件
 */
export async function runScrapingJob(
  timeRange: TimeRange,
  keyword: string | null = null
) {
  console.log(`開始執行 ${timeRange} ${keyword ? `- ${keyword}` : '熱門'} 爬蟲任務`);

  try {
    // 抓取專案資料
    const repositories = await scrapeTrendingRepositories(
      timeRange,
      keyword
    );

    console.log(`抓取完成，獲取了 ${repositories.length} 個儲存庫`);

    // 保存已抓取的資料
    if (repositories.length > 0) {
      await saveTrendingRepositories(repositories, timeRange, keyword);
      console.log(`成功抓取 ${repositories.length} 個儲存庫並保存到資料庫`);
    } else {
      console.warn('沒有抓取到任何儲存庫，跳過資料庫保存操作');
    }

    return {
      success: true,
      count: repositories.length
    };
  } catch (error) {
    console.error(`爬蟲任務執行失敗: ${error}`);
    return {
      success: false,
      error: error,
      count: 0
    };
  }
}

/**
 * 執行語言趨勢爬蟲
 * @returns 執行結果
 */
export async function runLanguageTrendingScraping(): Promise<{success: boolean, message: string, count?: number}> {
  // 創建爬蟲任務記錄
  const jobLog = await prisma.scrapingJobLog.create({
    data: {
      jobName: 'language',
      startTime: new Date(),
      status: 'running',
      message: '開始執行各語言熱門專案爬蟲'
    }
  });

  console.log('=========================================');
  console.log('開始執行各語言熱門專案爬蟲...');
  console.log('=========================================');
  let totalRepoCount = 0;

  try {
    // 輪流爬取各種語言的趨勢專案
    for (const language of POPULAR_LANGUAGES) {
      console.log('=========================================');
      console.log(`開始爬取 ${language} 語言的趨勢專案`);
      console.log('=========================================');

      // 爬取每日語言趨勢
      console.log(`正在爬取 ${language} 每日趨勢...`);
      const dailyResult = await runScrapingJob('daily', language);
      const dailyCount = Array.isArray(dailyResult) ? dailyResult.length :
                       (dailyResult && typeof dailyResult === 'object' && 'count' in dailyResult) ?
                       dailyResult.count : 0;
      totalRepoCount += dailyCount;

      // 等待一段時間避免被限流
      await delay(SCRAPER_CONFIG.TASK_DELAY_MIN);

      // 爬取每週語言趨勢
      console.log(`正在爬取 ${language} 每週趨勢...`);
      const weeklyResult = await runScrapingJob('weekly', language);
      const weeklyCount = Array.isArray(weeklyResult) ? weeklyResult.length :
                        (weeklyResult && typeof weeklyResult === 'object' && 'count' in weeklyResult) ?
                        weeklyResult.count : 0;
      totalRepoCount += weeklyCount;

      // 等待一段時間避免被限流
      await delay(SCRAPER_CONFIG.TASK_DELAY_MIN);

      // 爬取每月語言趨勢
      console.log(`正在爬取 ${language} 每月趨勢...`);
      const monthlyResult = await runScrapingJob('monthly', language);
      const monthlyCount = Array.isArray(monthlyResult) ? monthlyResult.length :
                         (monthlyResult && typeof monthlyResult === 'object' && 'count' in monthlyResult) ?
                         monthlyResult.count : 0;
      totalRepoCount += monthlyCount;

      console.log(`完成 ${language} 語言爬蟲，共獲取 ${dailyCount + weeklyCount + monthlyCount} 個專案`);
      console.log('=========================================');

      // 等待一段時間避免被限流
      await delay(SCRAPER_CONFIG.TASK_DELAY_MIN);
    }

    console.log('=========================================');
    console.log('所有語言爬蟲任務完成');
    console.log('=========================================');

    // 更新任務記錄為成功
    await prisma.scrapingJobLog.update({
      where: { id: jobLog.id },
      data: {
        endTime: new Date(),
        status: 'success',
        recordCount: totalRepoCount,
        message: `成功爬取 ${totalRepoCount} 個各語言熱門專案（每日、每週、每月）`
      }
    });

    return { success: true, message: `成功爬取 ${totalRepoCount} 個各語言熱門專案（每日、每週、每月）`, count: totalRepoCount };
  } catch (error) {
    // 更新任務記錄為失敗
    await prisma.scrapingJobLog.update({
      where: { id: jobLog.id },
      data: {
        endTime: new Date(),
        status: 'failure',
        recordCount: totalRepoCount,
        message: `爬蟲失敗: ${error instanceof Error ? error.message : String(error)}`
      }
    });

    console.error('各語言熱門專案爬蟲失敗:', error);
    return {
      success: false,
      message: `爬取各語言熱門專案失敗: ${error instanceof Error ? error.message : String(error)}`,
      count: totalRepoCount
    };
  }
}
