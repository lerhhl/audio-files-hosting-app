export const POSTGRES_CONNECTION_STRING = process.env.DATABASE_URL ?? "";
export const SECRET_KEY = process.env.SESSION_SECRET ?? "";
export const APP_BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
export const PINO_LOG_LEVEL = process.env.PINO_LOG_LEVEL ?? "info";
