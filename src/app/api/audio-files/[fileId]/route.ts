import { MAX_FILE_SIZE } from "@/app/constants";
import { getAudioFileById } from "@/lib/database";
import { verifySession } from "@/lib/session";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { username, isAuth } = await verifySession();
  if (!isAuth || !username) {
    return NextResponse.json(
      { error: "Session expired" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const fileId = req.nextUrl.pathname.split("/").pop();

  if (!fileId || !parseInt(fileId)) {
    return NextResponse.json(
      { error: "Invalid File ID" },
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const audioFile = await getAudioFileById(parseInt(fileId));

  if (!audioFile) {
    return NextResponse.json(
      { error: "Audio file not found" },
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const { createdBy, filePath, mimeType: fileType } = audioFile;

  if (createdBy !== username) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get the file from local storage with audioFile.filePath
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    // Range requests are used when a client (like a browser or a media player)
    // wants to download only a specific portion of a file, rather than the entire file.
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      if (!fileStream) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      if (start >= fileSize || end >= fileSize) {
        return NextResponse.json(
          { error: "Range Not Satisfiable" },
          { status: 416, headers: { "Content-Type": "application/json" } }
        );
      }

      if (start < 0 || end < 0 || chunkSize < 0 || chunkSize > fileSize) {
        return NextResponse.json(
          { error: "Invalid Range" },
          { status: 416, headers: { "Content-Type": "application/json" } }
        );
      }

      if (chunkSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Chunk size too large" },
          { status: 416, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(fileStream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": fileType,
        },
      });
    } else {
      const fileStream = fs.createReadStream(filePath);

      return new Response(fileStream as any, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": fileType,
        },
      });
    }
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
