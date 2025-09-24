import { createClient } from "redis";


export const redis = await createClient({ url: process.env.CACHE_URL }).connect();