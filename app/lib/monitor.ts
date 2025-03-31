/**
 * 獲取服務器狀態
 * @returns 服務器狀態資訊
 */
export async function getServerStatus() {
  // 模擬獲取服務器運行時間
  const uptime = getUptimeString();

  return {
    uptime,
    // 其他狀態可在此添加
  };
}

/**
 * 獲取運行時間字符串
 */
function getUptimeString(): string {
  // 假設服務器已運行的天數（隨機生成用於模擬）
  const days = Math.floor(Math.random() * 30);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);

  if (days > 0) {
    return `${days}天 ${hours}小時 ${minutes}分鐘`;
  } else if (hours > 0) {
    return `${hours}小時 ${minutes}分鐘`;
  } else {
    return `${minutes}分鐘`;
  }
}
