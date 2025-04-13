import { PINO_LOG_LEVEL } from "@/app/config";
import pino from "pino";

export const logger = pino({
  redact: ["requestHeaders.authorization"],
  level: PINO_LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
