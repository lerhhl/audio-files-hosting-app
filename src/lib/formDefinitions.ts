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

export const USERNAME_SPEC = {
  min: {
    value: 3,
    message: generateLengthErrorMessage("Name", 3, "min"),
  },
  max: {
    value: 10,
    message: generateLengthErrorMessage("Name", 10, "max"),
  },
};

export const PASSWORD_SPEC = {
  min: {
    value: 3,
    message: generateLengthErrorMessage("Password", 3, "min"),
  },
  max: {
    value: 20,
    message: generateLengthErrorMessage("Password", 20, "max"),
  },
};

const AUDIO_FILE_SPEC = {
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

export const createUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(USERNAME_SPEC.min.value, { message: USERNAME_SPEC.min.message })
    .max(USERNAME_SPEC.max.value, { message: USERNAME_SPEC.max.message }),
  password: z
    .string()
    .trim()
    .min(PASSWORD_SPEC.min.value, { message: PASSWORD_SPEC.min.message })
    .max(PASSWORD_SPEC.max.value, { message: PASSWORD_SPEC.max.message }),
});

export const updateUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(USERNAME_SPEC.min.value, { message: USERNAME_SPEC.min.message })
    .max(USERNAME_SPEC.max.value, { message: USERNAME_SPEC.max.message }),
  newPassword: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value ||
        (value.length >= PASSWORD_SPEC.min.value &&
          value.length <= PASSWORD_SPEC.max.value),
      {
        message: `New password must be between ${PASSWORD_SPEC.min.value} and ${PASSWORD_SPEC.max.value} characters long.`,
      }
    ),
});

export const createAudioFileRecordFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(AUDIO_FILE_SPEC.description.min.value, {
      message: AUDIO_FILE_SPEC.description.min.message,
    })
    .max(AUDIO_FILE_SPEC.description.max.value, {
      message: AUDIO_FILE_SPEC.description.max.message,
    }),
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
    .refine((file) => file.type, {
      message: "File type must be specified.",
    })
    .refine((file) => ALLOWABLE_AUDIO_CODECS.includes(file.type), {
      message: `File type must be one of the following: ${ALLOWABLE_AUDIO_CODECS.map(
        (codec) => {
          return codec.split("/")[1];
        }
      ).join(", ")}`,
    }),
});
