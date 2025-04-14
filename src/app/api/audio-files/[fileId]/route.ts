import { MAX_FILE_UPLOAD_SIZE } from "@/app/constants";
import { getAudioFileById } from "@/lib/database";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

type validationSuccess = {
  filePath: string;
  fileType: string;
};

type validationError = {
  error: string;
  status: number;
};

export async function GET(req: NextRequest) {
  const validationResult = await validation(req);

  const { error, status } = validationResult as validationError;

  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const { filePath, fileType } = validationResult as validationSuccess;

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
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      if (start >= fileSize || end >= fileSize) {
        return NextResponse.json(
          { error: "Range Not Satisfiable" },
          { status: 416 }
        );
      }

      if (start < 0 || end < 0 || chunkSize < 0 || chunkSize > fileSize) {
        return NextResponse.json({ error: "Invalid Range" }, { status: 416 });
      }

      if (chunkSize > MAX_FILE_UPLOAD_SIZE.bytes) {
        return NextResponse.json(
          { error: "Chunk size too large" },
          { status: 416 }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Response(fileStream as any, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": fileType,
        },
      });
    }
  } catch (error) {
    logger.error(error, "Error reading file:");
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

async function validation(
  req: NextRequest
): Promise<validationSuccess | validationError> {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return { error: "Session expired", status: 401 };
  }

  const fileId = req.nextUrl.pathname.split("/").pop();

  if (!fileId || !parseInt(fileId)) {
    return { error: "Invalid File ID", status: 400 };
  }

  const audioFile = await getAudioFileById(parseInt(fileId));

  if (!audioFile) {
    return { error: "Audio file not found", status: 404 };
  }

  const { createdBy, filePath, mimeType: fileType } = audioFile;

  if (createdBy !== userId) {
    return { error: "Unauthorized", status: 403 };
  }

  return {
    filePath,
    fileType,
  };
}
