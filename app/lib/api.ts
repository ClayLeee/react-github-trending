/**
 * 客戶端 API 工具
 * 這些函數可以安全地在瀏覽器中使用
 */

/**
 * 獲取每日趨勢項目
 * @param language 可選的程式語言過濾
 * @returns 返回每日趨勢項目列表
 */
export async function fetchDailyTrendingRepositories(language?: string) {
  try {
    const params = new URLSearchParams();
    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`/api/trending/repositories/daily?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching daily trending repositories:", error);
    throw error;
  }
}

/**
 * 獲取每週趨勢項目
 * @param language 可選的程式語言過濾
 * @returns 返回每週趨勢項目列表
 */
export async function fetchWeeklyTrendingRepositories(language?: string) {
  try {
    const params = new URLSearchParams();
    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`/api/trending/repositories/weekly?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weekly trending repositories:", error);
    throw error;
  }
}

/**
 * 獲取月度趨勢項目
 * @param language 可選的程式語言過濾
 * @returns 返回月度趨勢項目列表
 */
export async function fetchMonthlyTrendingRepositories(language?: string) {
  try {
    const params = new URLSearchParams();
    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`/api/trending/repositories/monthly?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching monthly trending repositories:", error);
    throw error;
  }
}

/**
 * 獲取特定語言的趨勢項目
 * @param language 程式語言
 * @param timeRange 時間範圍 (daily, weekly, 或 monthly)
 * @returns 返回指定語言的趨勢項目列表
 */
export async function fetchLanguageTrendingRepositories(language: string, timeRange: 'daily' | 'weekly' | 'monthly' = 'daily') {
  try {
    const params = new URLSearchParams();

    // 處理 C# 的特殊情況
    let normalizedLang = language;
    if (language.toLowerCase() === 'c%23' || language.toLowerCase() === 'csharp') {
      normalizedLang = 'c#';
    }

    params.append('language', normalizedLang);
    params.append('timeRange', timeRange);
    params.append('pageSize', '50'); // 獲取更多項目以展示

    // 使用專門的語言趨勢 API 端點
    const response = await fetch(`/api/trending/repositories/language?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching ${language} trending repositories:`, error);
    throw error;
  }
}

/**
 * 獲取可用的程式語言列表
 * @returns 返回語言列表
 */
export async function fetchLanguages() {
  try {
    const response = await fetch('/api/trending/languages');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
}

/**
 * 獲取語言趨勢數據
 * @param language 程式語言
 * @param timeRange 時間範圍 (daily 或 weekly)
 * @returns 返回指定語言的趨勢數據
 */
export async function fetchLanguageTrends(language: string, timeRange: 'daily' | 'weekly' = 'daily') {
  try {
    const params = new URLSearchParams();
    params.append('language', language);
    params.append('timeRange', timeRange);

    const response = await fetch(`/api/trending/language-trends?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${language} trends:`, error);
    throw error;
  }
}

/**
 * 獲取熱門語言列表及其使用率
 * @returns 返回語言使用統計資料
 */
export async function fetchLanguagePopularity() {
  try {
    const response = await fetch('/api/trending/language-popularity');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching language popularity:", error);
    throw error;
  }
}

/**
 * 獲取歷史數據
 * @param startDate 開始日期
 * @param endDate 結束日期
 * @param language 可選的程式語言過濾
 * @returns 返回指定日期範圍的項目列表
 */
export async function fetchHistoricalData(startDate: Date, endDate: Date, language?: string) {
  try {
    const params = new URLSearchParams();
    params.append('startDate', startDate.toISOString());
    params.append('endDate', endDate.toISOString());

    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`/api/trending/history?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}
