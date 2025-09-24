import { z, ZodError } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  DIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
  SERVICE_ROLE_KEY: z.string(),
  COLT_API_USERNAME: z.string(),
  COLT_API_PASSWORD: z.string(),
  REDIS_URL: z.string(),
  CACHE_URL: z.string(),
  ZOHO_CLIENT_ID: z.string(),
  ZOHO_CLIENT_SECRET: z.string(),
  ZOHO_REDIRECT_URI: z.string(),
  ZOHO_REFRESH_TOKEN: z.string()
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("Invalid ENV");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
