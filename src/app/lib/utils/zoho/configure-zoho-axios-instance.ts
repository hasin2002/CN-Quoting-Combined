import axios, { AxiosInstance } from "axios";
import { createAxiosInterceptor, TokenProvider } from "../quoting/bt-axios-instance";
import { 
  getZohoAccessToken, 
  refreshZohoAccessToken 
} from "./refresh-zohocrm-token";

// Zoho CRM Token Provider implementation
class ZohoTokenProvider implements TokenProvider {
  async getToken(): Promise<string | null> {
    return await getZohoAccessToken();
  }

  async refreshToken(): Promise<void> {
    await refreshZohoAccessToken();
  }
}

// Create Zoho CRM Axios instance
export const zohoCrmInstance: AxiosInstance = axios.create({
  baseURL: "https://www.zohoapis.eu",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create token provider instance
const zohoTokenProvider = new ZohoTokenProvider();

// Setup interceptors using the abstracted utility
createAxiosInterceptor({
  maxRetries: 1,
  tokenProvider: zohoTokenProvider,
  instance: zohoCrmInstance,
});

export default zohoCrmInstance;
