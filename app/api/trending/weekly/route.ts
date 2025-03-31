import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // 重定向到每週趨勢 API
  const searchParams = request.nextUrl.searchParams.toString();
  const redirectUrl = `/api/trending/repositories/weekly${searchParams ? `?${searchParams}` : ''}`;

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
