"use server";

import {
  AUDIO_FILES_PATH,
  AUDIO_UPLOAD_FOLDER,
  SESSION_EXPIRED_ERROR,
} from "@/app/constants";
import { UploadVideoFormState } from "@/components/types";
import {
  createAudioFileRecord,
  getAllAudioFilesByUsername,
} from "@/lib/database";
import { createAudioFileRecordFormSchema } from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import { CreateAudioFileInput } from "@/lib/types";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

export async function getAllAudioFilesByUsernameAction() {
  const { username } = await verifySession();

  if (!username) {
    logger.error("No username found in session.");
    return [];
  }

  try {
    const audioFiles = await getAllAudioFilesByUsername(username);
    return audioFiles;
  } catch (error) {
    logger.error(error, "Error fetching audio files:");
    return [];
  }
}

export async function createAudioFileRecordAction(
  formData: FormData
): Promise<UploadVideoFormState> {
  const { isAuth, username } = await verifySession();
  if (!isAuth || !username) {
    return {
      success: false,
      errors: {
        server: SESSION_EXPIRED_ERROR,
      },
    };
  }

  try {
    logger.info("Validating the audio file...");

    const validatedFields = createAudioFileRecordFormSchema.safeParse({
      description: formData.get("description"),
      category: formData.get("category"),
      file: formData.get("file"),
    });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        success: false,
        errors,
      };
    }

    const { description, category } = validatedFields.data;
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        errors: {
          file: ["No file uploaded"],
        },
      };
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { name, size: fileSize, type: fileType } = file;
    const fileName = `${Date.now()}-${name}`;
    const filePathToSave = `./${AUDIO_UPLOAD_FOLDER}/${username}/${fileName}`;
    const fileDir = path.dirname(filePathToSave);

    logger.info({ filePathToSave, fileSize }, "Saving audio file to server:");

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    fs.writeFileSync(filePathToSave, fileBuffer);

    logger.info({ filePathToSave, fileSize }, "Saved audio file to server:");

    const createAudioFileInput: CreateAudioFileInput = {
      username,
      description,
      category,
      mimeType: fileType,
      filePath: filePathToSave,
    };

    logger.info(createAudioFileInput, "Inserting audio file into database:");

    await createAudioFileRecord(createAudioFileInput);

    logger.info(createAudioFileInput, "Inserted audio file into database");

    revalidatePath(AUDIO_FILES_PATH);

    return { success: true, message: "Uploaded audio file successfully" };
  } catch (error) {
    logger.error(error, "Error uploading audio file:");
    return { success: false, message: "Failed to upload audio file" };
  }
}
