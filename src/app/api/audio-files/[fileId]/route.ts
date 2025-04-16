import { MAX_FILE_UPLOAD_SIZE } from "@/app/constants";
import { getAudioFileById } from "@/lib/database";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import {
  GetFileResponse,
  GetFileValidationError,
  GetFileValidationResult,
  GetFileValidationSuccess,
} from "@/lib/types";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * tags:
 *   - Audio Files
 * /api/audio-files/{fileId}:
 *   get:
 *     summary: Get an audio file by ID
 *     description: Retrieve an audio file by its ID. Supports range requests for partial file downloads.
 *     parameters:
 *       - name: fileId
 *         in: path
 *         required: true
 *         description: The ID of the audio file to retrieve.
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: range
 *         in: header
 *         required: false
 *         description: The range of bytes to retrieve (for partial downloads).
 *         schema:
 *           type: string
 *           example: bytes=0-1023
 *     responses:
 *       200:
 *         description: Returns the full audio file.
 *         headers:
 *           Content-Length:
 *             description: The size of the file in bytes.
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The MIME type of the file.
 *             schema:
 *               type: string
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       206:
 *         description: Returns a partial audio file (range request).
 *         headers:
 *           Content-Range:
 *             description: The range of bytes returned.
 *             schema:
 *               type: string
 *               example: bytes 0-1023/2048
 *           Content-Length:
 *             description: The size of the returned chunk in bytes.
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The MIME type of the file.
 *             schema:
 *               type: string
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request (e.g., invalid file ID or range).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid File ID
 *       401:
 *         description: Unauthorized (e.g., session expired).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Session expired
 *       403:
 *         description: Forbidden (e.g., user does not own the file).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden to retrieve the file
 *       404:
 *         description: File not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: File not found
 *       416:
 *         description: Range not satisfiable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Range Not Satisfiable
 */
export async function GET(req: NextRequest): Promise<GetFileResponse> {
  const GetFileValidationResult = await validation(req);

  const { error, status } = GetFileValidationResult as GetFileValidationError;

  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const { filePath, fileType } =
    GetFileValidationResult as GetFileValidationSuccess;

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

async function validation(req: NextRequest): Promise<GetFileValidationResult> {
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
    return { error: "Forbidden to retrieve the file", status: 403 };
  }

  return {
    filePath,
    fileType,
  };
}
