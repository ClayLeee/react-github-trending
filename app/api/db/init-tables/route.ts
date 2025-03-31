import { NextResponse } from 'next/server';
import { initializeDatabaseTables } from '@/app/lib/db-init';
import { headers } from 'next/headers';

/**
 * API 路由用於手動初始化資料庫表結構
 * POST /api/db/init-tables
 */
export async function POST() {
  try {
    // 檢查是否在伺服器環境
    if (typeof window !== 'undefined') {
      return NextResponse.json({ error: '此 API 只能在伺服器端運行' }, { status: 400 });
    }

    // 檢查授權，這裡只是一個簡單的檢查，您可以根據需要實施更嚴格的安全措施
    const headersList = headers();
    const authorization = headersList.get('authorization');

    // 檢查環境變數中的 API 金鑰，如果未設置，則使用安全模式
    // 在生產環境中，您應該設置更強的安全機制
    const apiKey = process.env.DB_INIT_API_KEY;

    // 如果啟用了安全模式但未提供有效授權
    if (apiKey && (!authorization || !authorization.startsWith('Bearer ') || authorization.substring(7) !== apiKey)) {
      return NextResponse.json({ error: '未授權的請求' }, { status: 401 });
    }

    // 執行初始化
    await initializeDatabaseTables();

    // 返回成功響應
    return NextResponse.json({
      message: '資料庫表結構初始化成功完成',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('初始化資料庫表結構時發生錯誤:', error);

    // 返回錯誤響應
    return NextResponse.json({
      error: '初始化資料庫表結構失敗',
      message: error instanceof Error ? error.message : '未知錯誤',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
