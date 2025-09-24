import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { pinoLogger } from "./middlewares/pino-logger";
import { AppBindings } from "./types/types";
import { defaultHook } from "stoker/openapi";
import { cors } from "hono/cors";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());
  app.use(serveEmojiFavicon("💻"));

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS", "HEAD"], // Add other methods if needed
      allowHeaders: ["Content-Type", "Authorization"], // Add other headers if needed
    })
  );

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
