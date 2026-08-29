import { NextResponse } from "next/server";
import { COINS_INDEXER_URL } from "@/app/utils/httpClient";

export async function GET() {
  try {
    const response = await fetch(COINS_INDEXER_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return NextResponse.json(
      { error: "Failed to fetch coins" },
      { status: 500 }
    );
  }
}
