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
import { verifySession } from "@/lib/session";
import { CreateAudioFileInput } from "@/lib/types";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

export async function getAllAudioFilesByUsernameAction() {
  const { username } = await verifySession();

  if (!username) {
    console.error("No username found in session.");
    return [];
  }

  try {
    const audioFiles = await getAllAudioFilesByUsername(username);
    return audioFiles;
  } catch (error) {
    console.error("Error fetching audio files:", error);
    return [];
  }
}

export async function createAudioFileRecordAction(
  _state: UploadVideoFormState,
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
    console.log("validating the audio file...");

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

    console.log("saving audio file to server:", {
      filePathToSave,
      fileSize,
    });

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    fs.writeFileSync(filePathToSave, fileBuffer);

    console.log("saved audio file to server:", {
      filePathToSave,
      fileSize,
    });

    const createAudioFileInput: CreateAudioFileInput = {
      username,
      description,
      category,
      mimeType: fileType,
      filePath: filePathToSave,
    };

    console.log("inserting audio file into database:", createAudioFileInput);

    await createAudioFileRecord(createAudioFileInput);

    console.log("inserted audio file into database", createAudioFileInput);

    revalidatePath(AUDIO_FILES_PATH);

    return { success: true, message: "Audio file uploaded successfully" };
  } catch (error) {
    console.error("Error uploading audio file:", error);
    return { success: false, message: "Failed to upload audio file" };
  }
}
