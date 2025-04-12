import {
  ALLOWABLE_AUDIO_CATEGORIES,
  ALLOWABLE_AUDIO_CODECS,
  MAX_FILE_UPLOAD_SIZE,
} from "@/app/constants";
import { z } from "zod";

const generateLengthErrorMessage = (
  field: string,
  value: number,
  type: "min" | "max"
) => {
  if (type === "min") {
    return `${field} must be at least ${value} characters long.`;
  } else {
    return `${field} must be at most ${value} characters long.`;
  }
};

const usernameSpec = {
  min: {
    value: 3,
    message: generateLengthErrorMessage("Name", 3, "min"),
  },
  max: {
    value: 10,
    message: generateLengthErrorMessage("Name", 10, "max"),
  },
};

const passwordSpec = {
  min: {
    value: 3,
    message: generateLengthErrorMessage("Password", 3, "min"),
  },
  max: {
    value: 20,
    message: generateLengthErrorMessage("Password", 20, "max"),
  },
};

const audioFileSpec = {
  description: {
    min: {
      value: 3,
      message: generateLengthErrorMessage("Description", 3, "min"),
    },
    max: {
      value: 100,
      message: generateLengthErrorMessage("Description", 100, "max"),
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
    .refine((file) => file.size <= MAX_FILE_UPLOAD_SIZE.bytes, {
      message: `File size must be less than ${MAX_FILE_UPLOAD_SIZE.mb}MB.`,
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
