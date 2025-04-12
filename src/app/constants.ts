export const LOGIN_PATH = "/login";
export const DEFAULT_HOME_PATH = "/home";
export const AUDIO_FILES_PATH = "/audio-files";
export const USERS_MANAGEMENT_PATH = "/users-management";

export const SESSION_EXPIRATION_TIME = {
  days: 1,
  hours: 24,
  minutes: 1440,
  seconds: 86400,
  milliseconds: 86400000,
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const AUDIO_UPLOAD_FOLDER = "./audio_uploads";
export const ALLOWABLE_AUDIO_CODECS = [
  "aac",
  "ac3",
  "flac",
  "mp3",
  "ogg",
  "opus",
  "wav",
  "wma",
  "webm",
  "mpeg",
  "mp4",
];

// Error messages
export const INVALID_USERNAME_OR_PASSWORD_ERROR =
  "Invalid username or password";
export const SESSION_EXPIRED_ERROR = "Session expired. Please log in again.";
