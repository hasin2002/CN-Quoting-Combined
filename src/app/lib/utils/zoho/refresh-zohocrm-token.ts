import axios from "axios";
import env from "../../../env";
import { redis } from "../../services/redis-client";
import { CustomError } from "../../schemas/errors/custom-error";

type ZohoAccessTokenResponse = {
  access_token: string;
  refresh_token?: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
};

type ZohoTokenRefreshResponse = {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
};

type Result = { success: boolean };

export const generateZohoAccessToken = async (): Promise<Result> => {
  try {
    const response = await axios.post<ZohoAccessTokenResponse>(
      "https://accounts.zoho.eu/oauth/v2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        redirect_uri: env.ZOHO_REDIRECT_URI,
        code: "AUTHORIZATION_CODE", // This would need to be obtained from OAuth flow
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.access_token) {
      await redis.set("zoho_access_token", response.data.access_token);
      
      // Store refresh token if provided
      if (response.data.refresh_token) {
        await redis.set("zoho_refresh_token", response.data.refresh_token);
      }
      
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    return Promise.reject(
      new CustomError({
        message: "Failed to generate Zoho access token.",
        source: "generateZohoAccessToken() function",
      })
    );
  }
};

export const refreshZohoAccessToken = async (): Promise<Result> => {
  try {
    // First try to get refresh token from Redis, fallback to env variable
    let refreshToken = await redis.get("zoho_refresh_token");
    
    if (!refreshToken) {
      // Fallback to environment variable
      refreshToken = env.ZOHO_REFRESH_TOKEN;
    }
    
    if (!refreshToken) {
      throw new CustomError({
        message: "No refresh token available for Zoho CRM.",
        source: "refreshZohoAccessToken() function",
      });
    }

    const response = await axios.post<ZohoTokenRefreshResponse>(
      "https://accounts.zoho.eu/oauth/v2/token",
      new URLSearchParams({
        refresh_token: refreshToken as string,
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        redirect_uri: env.ZOHO_REDIRECT_URI,
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.access_token) {
      await redis.set("zoho_access_token", response.data.access_token);
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Zoho token refresh error:", error);
    return Promise.reject(
      new CustomError({
        message: `Failed to refresh Zoho access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        source: "refreshZohoAccessToken() function",
      })
    );
  }
};

export const getZohoAccessToken = async (): Promise<string | null> => {
  // First try to get access token from Redis
  let token = await redis.get("zoho_access_token");
  
  if (!token) {
    // If no token in Redis, try to refresh using the refresh token
    try {
      const refreshResult = await refreshZohoAccessToken();
      if (refreshResult.success) {
        // Get the newly refreshed token
        token = await redis.get("zoho_access_token");
      }
    } catch (error) {
      // If refresh fails, return null
      return null;
    }
  }
  
  return token as string | null;
};

export const revokeZohoRefreshToken = async (): Promise<Result> => {
  try {
    const refreshToken = await redis.get("zoho_refresh_token");
    
    if (!refreshToken) {
      return { success: false };
    }

    await axios.post(
      "https://accounts.zoho.eu/oauth/v2/token/revoke",
      new URLSearchParams({
        token: refreshToken as string,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Clear tokens from Redis
    await redis.del("zoho_access_token");
    await redis.del("zoho_refresh_token");

    return { success: true };
  } catch (error) {
    return Promise.reject(
      new CustomError({
        message: "Failed to revoke Zoho refresh token.",
        source: "revokeZohoRefreshToken() function",
      })
    );
  }
};
