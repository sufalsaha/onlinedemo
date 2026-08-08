import { NextRequest, NextResponse } from "next/server";
import { searchBusinesses } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const results = await searchBusinesses(q);
  return NextResponse.json({ query: q, results });
}
