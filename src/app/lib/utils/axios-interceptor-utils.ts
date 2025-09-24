import { AxiosRequestConfig, AxiosInstance } from "axios";
import { CustomError } from "../schemas/errors/custom-error";

export type RetryQueueItem = {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
};

export interface TokenProvider {
  getToken(): Promise<string | null>;
  refreshToken(): Promise<void>;
}

export interface AxiosInterceptorConfig {
  maxRetries: number;
  tokenProvider: TokenProvider;
  instance: AxiosInstance;
}

export class AxiosInterceptorManager {
  private refreshAndRetryQueue: RetryQueueItem[] = [];
  private isRefreshing = false;
  private retryCounts: Record<string, number> = {};

  constructor(private config: AxiosInterceptorConfig) {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.config.instance.interceptors.request.use(
      async (config) => {
        try {
          const accessToken = await this.config.tokenProvider.getToken();
          if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return config;
        } catch (error) {
          return Promise.reject(
            new CustomError({
              message: "Request interceptor failed to set Authorization header.",
              source: "Axios request interceptor",
            })
          );
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.config.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: AxiosRequestConfig = error.config;

        // Unique identifier for the request
        const requestKey = `${originalRequest.method?.toUpperCase()} ${
          originalRequest.url
        }`;

        // Initialize retry count for this request if not present
        if (!this.retryCounts[requestKey]) {
          this.retryCounts[requestKey] = 0;
        }

        if (error.response && error.response.status === 401) {
          if (this.retryCounts[requestKey] >= this.config.maxRetries) {
            // Max retries reached, reject with error
            return Promise.reject(error);
          }

          if (!this.isRefreshing) {
            this.retryCounts[requestKey]++;
            this.isRefreshing = true;
            try {
              // Refresh the access token
              await this.config.tokenProvider.refreshToken();

              // Retry all requests in the queue with the new token
              this.refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                this.config.instance
                  .request(config)
                  .then((response) => resolve(response))
                  .catch((err) => reject(err));
              });

              // Clear the queue
              this.refreshAndRetryQueue.length = 0;

              // Retry the original request
              return this.config.instance(originalRequest);
            } catch (refreshError) {
              // Handle token refresh error
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          }

          // Add the original request to the queue
          return new Promise<void>((resolve, reject) => {
            this.refreshAndRetryQueue.push({ 
              config: originalRequest, 
              resolve, 
              reject 
            });
          });
        }

        // For non-401 errors, map and reject
        return Promise.reject(error);
      }
    );
  }
}

export const createAxiosInterceptor = (config: AxiosInterceptorConfig) => {
  return new AxiosInterceptorManager(config);
};
