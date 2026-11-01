import { NextResponse } from "next/server";
import {
  DEFAULT_CLUB_ID,
  DEFAULT_PLATFORM,
  fetchClub138351Stats,
} from "@/lib/fc27Api";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get("clubId") || DEFAULT_CLUB_ID;
  const platform = searchParams.get("platform") || DEFAULT_PLATFORM;

  try {
    const data = await fetchClub138351Stats(clubId, platform);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error en /api/club-stats:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las estadísticas del club." },
      { status: 500 }
    );
  }
}
