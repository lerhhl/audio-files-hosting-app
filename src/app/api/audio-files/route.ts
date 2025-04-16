import { AUDIO_UPLOAD_FOLDER, SESSION_EXPIRED_ERROR } from "@/app/constants";
import {
  createAudioFileRecord,
  getAllAudioFilesByUserid,
} from "@/lib/database";
import { createAudioFileRecordFormSchema } from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import { CreateAudioFileInput } from "@/lib/types";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * @swagger
 * tags:
 *   - Audio Files
 * /api/audio-files:
 *   get:
 *     summary: Get a list of audio files
 *     description: Retrieve a list of audio files for the authenticated user.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number to retrieve.
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of audio files to retrieve per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Returns a list of audio files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       description:
 *                         type: string
 *                         example: Sample audio file
 *                       category:
 *                         type: string
 *                         example: music
 *                       mimeType:
 *                         type: string
 *                         example: audio/mp3
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T12:00:00Z
 *                     required:
 *                       - id
 *                       - description
 *                       - category
 *                       - mimeType
 *                       - createdAt
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *               required:
 *                 - items
 *                 - totalCount
 *       400:
 *         description: Failed to fetch audio files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch audio files
 *               required:
 *                 - error
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Session expired
 *               required:
 *                 - error
 */
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

/**
 * @swagger
 * tags:
 *   - Audio Files
 * /api/audio-files:
 *   post:
 *     summary: Upload a new audio file
 *     description: Upload a new audio file for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: A description of the audio file.
 *                 example: Sample audio file
 *               category:
 *                 type: string
 *                 description: The category of the audio file.
 *                 example: music
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The audio file to upload.
 *     responses:
 *       200:
 *         description: Audio file uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Audio file uploaded successfully
 *       400:
 *         description: Failed to upload audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: Failed to upload audio file
 *                     description:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Description must be at least 3 characters long.
 *                     file:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: File type must be specified.
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Category must be one of the categories in the dropdown.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: Session expired
 */
export async function POST(req: NextRequest) {
  const { isAuth, userId } = await verifySession();
  if (!isAuth || !userId) {
    return NextResponse.json(
      { error: { server: SESSION_EXPIRED_ERROR } },
      { status: 401 }
    );
  }

  try {
    logger.info("Validating the audio file...");
    const formData = await req.formData();
    if (!formData) {
      return NextResponse.json(
        { error: { server: "No form data provided" } },
        { status: 400 }
      );
    }

    const validatedFields = createAudioFileRecordFormSchema.safeParse({
      description: formData.get("description"),
      category: formData.get("category"),
      file: formData.get("file"),
    });

    if (!validatedFields.success) {
      const error = validatedFields.error.flatten().fieldErrors;
      return NextResponse.json({ error }, { status: 400 });
    }

    const { description, category } = validatedFields.data;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: { file: ["No file uploaded"] } },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { name, size: fileSize, type: fileType } = file;
    const fileName = `${Date.now()}-${name}`;
    const filePathToSave = `./${AUDIO_UPLOAD_FOLDER}/${userId}/${fileName}`;
    const fileDir = path.dirname(filePathToSave);

    logger.info({ filePathToSave, fileSize }, "Saving audio file to server:");

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    fs.writeFileSync(filePathToSave, fileBuffer);

    logger.info({ filePathToSave, fileSize }, "Saved audio file to server:");

    const createAudioFileInput: CreateAudioFileInput = {
      userId,
      description,
      category,
      mimeType: fileType,
      filePath: filePathToSave,
    };

    logger.info(createAudioFileInput, "Inserting audio file into database:");

    await createAudioFileRecord(createAudioFileInput);

    logger.info(createAudioFileInput, "Inserted audio file into database");

    return NextResponse.json({ message: "Audio file uploaded successfully" });
  } catch (error) {
    logger.error(error, "Error uploading audio file:");

    return NextResponse.json(
      { error: { server: "Failed to upload audio file" } },
      { status: 400 }
    );
  }
}
