import { AppOpenAPI } from "./types/types";
import { apiReference } from "@scalar/hono-api-reference";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("doc", {
    openapi: "3.0.0",
    info: {
      version: "0.0.1",
      title: "Connected Networks Quoting API",
    },
  });

  app.get(
    "reference",
    apiReference({
      theme: "kepler",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "axios",
      },
      spec: {
        url: "/api/doc",
      },
    })
  );
}
