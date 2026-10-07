import { api } from "./api.service";
import type { AuthUser } from "@/types/api";

/**
 * User/account service — scaffolded for the upcoming CMS admin
 * (mirrors the legacy `/api/change-password`). Not used by the public site.
 */
export const userService = {
  async current(): Promise<AuthUser | null> {
    try {
      const { data } = await api.get<AuthUser>("/me");
      return data;
    } catch {
      return null;
    }
  },

  async changePassword(newPass: string): Promise<void> {
    await api.post("/change-password", { newPass });
  },
};
