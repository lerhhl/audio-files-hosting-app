export const LOGIN_PATH = "/login";
export const DEFAULT_HOME_PATH = "/home";
export const AUDIO_FILES_PATH = "/audio-files";
export const USERS_MANAGEMENT_PATH = "/users-management";

// The session expiration time is set to 1 day
const SESSION_EXPIRATION_TIME_DAYS = 1;
export const SESSION_EXPIRATION_TIME = {
  days: SESSION_EXPIRATION_TIME_DAYS,
  hours: SESSION_EXPIRATION_TIME_DAYS * 24,
  minutes: SESSION_EXPIRATION_TIME_DAYS * 24 * 60,
  seconds: SESSION_EXPIRATION_TIME_DAYS * 24 * 60 * 60,
  milliseconds: SESSION_EXPIRATION_TIME_DAYS * 24 * 60 * 60 * 1000,
};

// The maximum file size for audio uploads
const MAX_FILE_UPLOAD_SIZE_MB = 10; // 10 MB
export const MAX_FILE_UPLOAD_SIZE = {
  mb: MAX_FILE_UPLOAD_SIZE_MB,
  bytes: MAX_FILE_UPLOAD_SIZE_MB * 1024 * 1024,
};

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
export const ALLOWABLE_AUDIO_CATEGORIES = [
  "music",
  "podcast",
  "audiobook",
  "sound_effect",
  "voice_recording",
  "other",
];

// Error messages
export const INVALID_USERNAME_OR_PASSWORD_ERROR =
  "Invalid username or password";
export const SESSION_EXPIRED_ERROR = "Session expired. Please log in again.";
