import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        const response = await authApi.login(email, password);
        
        if (response.error) {
          set({ 
            error: response.error.message, 
            isLoading: false,
            user: null,
            token: null,
          });
          return false;
        }

        if (response.data) {
          set({
            user: response.data.user,
            token: response.data.token,
            isLoading: false,
            error: null,
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        const response = await authApi.register(email, password, name);
        
        if (response.error) {
          // Özel durum: Kullanıcı oluşturuldu ama email gönderilemedi
          // Backend 500 hatası döndürse bile, eğer "User created" mesajı varsa başarılı say
          const errorMessage = (response.error.message || "").toLowerCase();
          const errorStatus = response.error.status;
          
          // 500 hatası ve "user created" içeriyorsa veya sadece "user created" içeriyorsa
          if (errorMessage.includes("user created") || 
              errorMessage.includes("kullanıcı oluşturuldu") ||
              (errorStatus === 500 && errorMessage.includes("failed to send"))) {
            set({
              isLoading: false,
              error: null,
            });
            return true;
          }
          
          set({ 
            error: response.error.message, 
            isLoading: false,
            user: null,
            token: null,
          });
          return false;
        }

        set({
          isLoading: false,
          error: null,
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
        });
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthStore) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);

