import { BASE_URL } from "@/services/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/services/api";

type User = {
  id: string;
  email: string;
  role: "PRESIDENTE" | "REDATOR";
  nome: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async ({ email, password }) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          throw new Error("Login inválido");
        }

        const data = await res.json();

        set({
          user: data.user,
          token: data.access_token,
        });
      },

      logout: async () => {
        try {
          await apiFetch("/auth/logout", {
            method: "POST",
          });
        } finally {
          set({ user: null, token: null });
          useAuthStore.persist.clearStorage();
        }
      },
    }),
    {
      name: "auth-storage", // 🔥 salva no localStorage
    }
  )
);