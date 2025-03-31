import { NextRequest, NextResponse } from "next/server"
import { PROGRAMMING_LANGUAGES, LANGUAGE_DISPLAY_MAP, LANGUAGE_URL_MAP } from "@/app/lib/constants"

export async function GET(request: NextRequest) {
  try {
    // 返回預定義的語言列表
    return NextResponse.json(PROGRAMMING_LANGUAGES)
  } catch (error) {
    console.error("API error fetching languages:", error)
    return NextResponse.json(
      { error: "載入語言列表失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
