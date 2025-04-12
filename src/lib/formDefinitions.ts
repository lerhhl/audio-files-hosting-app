import { ALLOWABLE_AUDIO_CODECS, MAX_FILE_SIZE } from "@/app/constants";
import { z } from "zod";

export const CreateUserFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(10, { message: "Name must be at most 10 characters long." })
    .trim(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" })
    .max(20, { message: "Password must be at most 20 characters long." })
    .trim(),
});

export const createAudioFileRecordFormSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(100, { message: "Description must be at most 100 characters long." })
    .trim(),
  codec: z
    .string()
    .min(3, { message: "Codec must be at least 3 characters long." })
    .max(20, { message: "Codec must be at most 20 characters long." })
    .trim(),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "File must not be empty.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB.",
    })
    .refine(
      (file) => {
        const fileExtension = file.name?.split(".").pop()?.toLowerCase();
        return (
          !fileExtension ||
          !ALLOWABLE_AUDIO_CODECS.includes(`.${fileExtension}`)
        );
      },
      {
        message: "File must be an audio file.",
      }
    )
    .refine((file) => file.type),
});
