import axios, { AxiosInstance } from "axios";
import { createAxiosInterceptor, TokenProvider } from "./quoting/bt-axios-instance";
import { generateAccessToken } from "./quoting/gen-access-token";
import { redis } from "../services/redis-client";

// BT Token Provider implementation
class BtTokenProvider implements TokenProvider {
  async getToken(): Promise<string | null> {
    const token = await redis.get("global_access_token");
    console.log("👁👁: ", token);
    return token as string | null;
  }

  async refreshToken(): Promise<void> {
    await generateAccessToken();
  }
}

// Create BT Axios instance
export const btAxiosInstance: AxiosInstance = axios.create({
  baseURL: "https://api.wholesale.bt.com",
  headers: {
    "APIGW-Tracking-Header": crypto.randomUUID(),
  },
});

// Create token provider instance
const btTokenProvider = new BtTokenProvider();

// Setup interceptors using the abstracted utility
createAxiosInterceptor({
  maxRetries: 1,
  tokenProvider: btTokenProvider,
  instance: btAxiosInstance,
});

export default btAxiosInstance;
