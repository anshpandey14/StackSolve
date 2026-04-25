import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { auth as firebaseAuth, googleProvider, githubProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface IAuthStore {
  jwt: string | null;
  user: User | null;
  hydrated: boolean;

  setHydrated(): void;
  login(email: string, password: string): Promise<{ success: boolean; error?: string }>;
  createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; message?: string }>;
  socialLogin(provider: string): Promise<{ success: boolean; error?: string }>;
  logout(): void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async login(email: string, password: string) {
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.success) {
            set({ jwt: data.token, user: data.user });
            return { success: true };
          } else {
            return { success: false, error: data.error };
          }
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (data.success) {
            return { success: true, message: data.message };
          } else {
            return { success: false, error: data.error };
          }
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      logout() {
        set({ jwt: null, user: null });
      },

      async socialLogin(providerName: string) {
        try {
          const provider = providerName === "Google" ? googleProvider : githubProvider;
          const result = await signInWithPopup(firebaseAuth, provider);
          const firebaseUser = result.user;

          // Sync with our backend
          const response = await fetch(`${API_URL}/api/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL
            }),
          });

          const data = await response.json();

          if (data.success) {
            set({ jwt: data.token, user: data.user });
            return { success: true };
          } else {
            return { success: false, error: data.error };
          }
        } catch (error: any) {
          console.error("Social login error:", error);
          return { success: false, error: error.message };
        }
      }
    })),
    {
      name: "stackoverflow-auth",
      onRehydrateStorage() {
        return (state) => {
          state?.setHydrated();
        };
      },
    }
  )
);



