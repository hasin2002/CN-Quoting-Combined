import { logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "../../env";

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        level: env.NODE_ENV === "production" ? "info" : "debug",
        redact: ["headers.authorization"],
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        serializers: {
          err: (error: any) => {
            return {
              type: error.constructor.name,
              message: error.message,
              code: error.code,
              btError: error.response?.data && {
                message: error.response.data.message,
                code: error.response.data.code,
                statusCode: error.response.status,
              },
            };
          },
        },
      },
      env.NODE_ENV === "production"
        ? undefined
        : pretty({
            colorize: true,
            ignore: "pid,hostname,time,req,res",
            messageFormat: "{msg}",
            translateTime: false,
          })
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
