import { getAllAudioFilesByUserid } from "@/lib/database";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  try {
    const query = req.nextUrl.searchParams;
    const page = parseInt(query.get("page") ?? "1");
    const pageSize = parseInt(query.get("pageSize") ?? "10");
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const { items, totalCount } = await getAllAudioFilesByUserid(
      userId,
      offset,
      limit
    );

    return NextResponse.json(
      {
        items,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error, "Error fetching audio files");

    return NextResponse.json(
      { error: "Failed to fetch audio files" },
      { status: 400 }
    );
  }
}
