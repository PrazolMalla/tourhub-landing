import { api, setAuthToken } from "./api.service";
import type { AuthUser } from "@/types/api";

/**
 * Authentication service — scaffolded for the upcoming CMS admin (mirrors the
 * legacy `/api/login`, `/api/logout`, `/api/me`). Not used by the public site.
 */
export const authService = {
  async login(user: string, pass: string): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>("/login", { user, pass });
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/logout");
    setAuthToken(null);
  },

  async me(): Promise<AuthUser | null> {
    try {
      const { data } = await api.get<AuthUser>("/me");
      return data;
    } catch {
      return null;
    }
  },
};
