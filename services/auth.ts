import { Account, ID } from "react-native-appwrite";
import client from "@/lib/appwrite";
import { create } from "zustand";
import useSavedMoviesStore from "@/services/savedMovies";

const account = new Account(client);

interface User {
  $id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initialized: false,
  loading: false,

  init: async () => {
    try {
      const u = await account.get();
      await useSavedMoviesStore.getState().loadForUser(u.$id);
      set({ user: { $id: u.$id, name: u.name, email: u.email }, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      await account.createEmailPasswordSession({ email, password });
      const u = await account.get();
      await useSavedMoviesStore.getState().loadForUser(u.$id);
      set({ user: { $id: u.$id, name: u.name, email: u.email }, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      await account.create({ userId: ID.unique(), email, password, name });
      await account.createEmailPasswordSession({ email, password });
      const u = await account.get();
      await useSavedMoviesStore.getState().loadForUser(u.$id);
      set({ user: { $id: u.$id, name: u.name, email: u.email }, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
    } finally {
      useSavedMoviesStore.getState().clearMovies();
      set({ user: null });
    }
  },
}));

export default useAuthStore;
