import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { PROGRAMMING_LANGUAGES } from "@/app/lib/constants";
import { Prisma } from "@prisma/client";

// 獲取語言特定資料表名稱前綴
function getTablePrefix(language: string): string {
  // 對 C++ 和 C# 特殊處理
  if (language.toLowerCase() === 'c++') {
    return 'CPP';
  }
  if (language.toLowerCase() === 'c#') {
    return 'CSharp';
  }

  // 使用首字母大寫
  return language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
}

/**
 * GET /api/languages - 獲取所有可用的程式語言
 */
export async function GET() {
  try {
    // 從 PROGRAMMING_LANGUAGES 常量中獲取支持的語言列表
    const languageList = [...PROGRAMMING_LANGUAGES];

    // 格式化語言名稱，使其更適合顯示
    const formattedLanguages = languageList.map(lang => {
      // 特殊處理 C++ 和 C#
      if (lang.toLowerCase() === 'c++') return 'C++';
      if (lang.toLowerCase() === 'c#') return 'C#';

      // 一般情況：首字母大寫
      return lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
    }).sort();

    return NextResponse.json(formattedLanguages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { error: "無法獲取程式語言清單" },
      { status: 500 }
    );
  }
}
