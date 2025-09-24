import axios from "axios";
import env from "../../../env";
import { kv } from "@vercel/kv";
import { CustomError } from "../../schemas/errors/custom-error";
import { redis } from "../../services/redis-client";

type BtAccessTokenApi = {
  accessToken: string;
  token_type: string;
  expiresIn: number;
};

type Result = { success: boolean };

export const generateAccessToken = async (): Promise<Result> => {
  // Encode the client credentials in Base64
  const authString = Buffer.from(
    `${env.CONSUMER_KEY}:${env.CONSUMER_SECRET}`
  ).toString("base64");

  // Set the headers required by the API
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authString}`,
  };

  try {
    // Make the POST request to the OAuth endpoint using the axios instance
    const response = await axios.get<BtAccessTokenApi>(
      "https://api.wholesale.bt.com/oauth/accesstoken?grant_type=client_credentials",
      {
        headers: headers,
      }
    );
    // Check if the access token is present in the response
    if (response.data.accessToken) {
      await redis.set("global_access_token", response.data.accessToken);
      // await kv.set("global_access_token", "token");
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    // Handle different error scenarios
    return Promise.reject(
      new CustomError({
        message: "Internal server error. Failed to generate token.",
        source: "generateAccessToken() function",
      })
    );
  }
};
