// generateAccessToken.test.ts

import { generateAccessToken } from "./gen-access-token";
import axios from "axios";
import {redis} from "../../services/redis-client"

// Mock the axios module
jest.mock("axios");

// Mock the @vercel/kv module
jest.mock("../../services/redis-client", () => ({
  redis: {
    set: jest.fn(),
  },
}));

jest.mock("../../../env", () => ({
  default: {
    CONSUMER_KEY: "dummy_key",
    CONSUMER_SECRET: "dummy_secret",
  },
}));

describe("generateAccessToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should set the access token in redis store", async () => {
    const mockAccessToken = "fake_access_token";
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        accessToken: mockAccessToken,
      },
    });

    const result = await generateAccessToken();

    expect(result).toEqual({ success: true });
    expect(redis.set).toHaveBeenCalledWith("global_access_token", mockAccessToken);
  });

  it("should return success: false when accessToken is missing", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {},
    });

    const result = await generateAccessToken();

    expect(result).toEqual({ success: false });
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("should reject with a CustomError when axios request fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Request failed"));

    await expect(generateAccessToken()).rejects.toThrow(
      expect.objectContaining({
        message: "Internal server error. Failed to generate token.",
        source: "generateAccessToken() function",
      })
    );
    expect(redis.set).not.toHaveBeenCalled();
  });
});
