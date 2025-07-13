// import { create } from "zustand";
// import { auth } from "@/lib/auth";
// import { User } from "@/types/api";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   checkAuth: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   loading: true,

//   login: async (email: string, password: string) => {
//     try {
//       const { user, token } = await auth.login(email, password);
//       set({ user, token, isAuthenticated: true });
//     } catch (error) {
//       throw error;
//     }
//   },

//   logout: async () => {
//     await auth.logout();
//     set({ user: null, token: null, isAuthenticated: false });
//   },

//   checkAuth: async () => {
//     set({ loading: true });
//     try {
//       const isValid = await auth.verifyToken();
//       if (isValid) {
//         const user = await auth.getCurrentUser();
//         const token = localStorage.getItem("auth_token");
//         set({ user, token, isAuthenticated: true });
//       }
//     } catch (error) {
//       set({ user: null, token: null, isAuthenticated: false });
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));
