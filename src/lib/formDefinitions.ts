import {
  ALLOWABLE_AUDIO_CATEGORIES,
  ALLOWABLE_AUDIO_CODECS,
  MAX_FILE_SIZE,
} from "@/app/constants";
import { z } from "zod";

const usernameSpec = {
  min: {
    value: 3,
    message: "Name must be at least 3 characters long.",
  },
  max: {
    value: 10,
    message: "Name must be at most 10 characters long.",
  },
};

const passwordSpec = {
  min: {
    value: 3,
    message: "Password must be at least 3 characters long.",
  },
  max: {
    value: 20,
    message: "Password must be at most 20 characters long.",
  },
};

const audioFileSpec = {
  description: {
    min: {
      value: 3,
      message: "Description must be at least 3 characters long.",
    },
    max: {
      value: 100,
      message: "Description must be at most 100 characters long.",
    },
  },
};

export const CreateUserFormSchema = z.object({
  username: z
    .string()
    .min(usernameSpec.min.value, { message: usernameSpec.min.message })
    .max(usernameSpec.max.value, { message: usernameSpec.max.message })
    .trim(),
  password: z
    .string()
    .min(passwordSpec.min.value, { message: passwordSpec.min.message })
    .max(passwordSpec.max.value, { message: passwordSpec.max.message })
    .trim(),
});

export const createAudioFileRecordFormSchema = z.object({
  description: z
    .string()
    .min(audioFileSpec.description.min.value, {
      message: audioFileSpec.description.min.message,
    })
    .max(audioFileSpec.description.max.value, {
      message: audioFileSpec.description.max.message,
    })
    .trim(),
  category: z
    .string()
    .trim()
    .refine((value) => ALLOWABLE_AUDIO_CATEGORIES.includes(value), {
      message: "Category must be one of the categories in the dropdown.",
    }),
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
