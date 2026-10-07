import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Central Axios instance for the app.
 *
 * Base URL comes from `NEXT_PUBLIC_API_BASE_URL` (defaults to same-origin `/api`,
 * matching the legacy Express endpoints). Interceptors add auth + uniform error
 * handling so feature services stay thin.
 */
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const TOKEN_KEY = "hm_token";

/** Persist an auth token (used by the future CMS admin). */
export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// Request interceptor — attach bearer token when present.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalise errors into a readable message.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);
