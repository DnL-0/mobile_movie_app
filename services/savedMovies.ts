import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const storageKey = (userId: string) => `saved-movies-${userId}`;

export interface SavedMovie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  savedAt?: number;
}

interface SavedMoviesStore {
  movies: SavedMovie[];
  userId: string | null;
  loading: boolean;
  loadForUser: (userId: string) => Promise<void>;
  clearMovies: () => void;
  saveMovie: (movie: SavedMovie) => Promise<void>;
  removeSavedMovie: (movieId: number) => Promise<void>;
  getSavedMovies: () => SavedMovie[];
  isMovieSaved: (movieId: number) => boolean;
}

const useSavedMoviesStore = create<SavedMoviesStore>((set, get) => ({
  movies: [],
  userId: null,
  loading: false,

  loadForUser: async (userId: string) => {
    set({ loading: true });
    try {
      const json = await AsyncStorage.getItem(storageKey(userId));
      const movies: SavedMovie[] = json ? JSON.parse(json) : [];
      set({ movies, userId, loading: false });
    } catch {
      set({ movies: [], userId, loading: false });
    }
  },

  clearMovies: () => set({ movies: [], userId: null }),

  saveMovie: async (movie: SavedMovie) => {
    const { movies, userId } = get();
    if (!userId || movies.some((m) => m.id === movie.id)) return;
    const updated = [...movies, { ...movie, savedAt: Date.now() }];
    set({ movies: updated });
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(updated));
  },

  removeSavedMovie: async (movieId: number) => {
    const { movies, userId } = get();
    if (!userId) return;
    const updated = movies.filter((m) => m.id !== movieId);
    set({ movies: updated });
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(updated));
  },

  getSavedMovies: () => get().movies,

  isMovieSaved: (movieId: number) => get().movies.some((m) => m.id === movieId),
}));

export const saveMovie = async (movie: SavedMovie) => {
  await useSavedMoviesStore.getState().saveMovie(movie);
  return true;
};

export const removeSavedMovie = async (movieId: number) => {
  await useSavedMoviesStore.getState().removeSavedMovie(movieId);
  return true;
};

export const getSavedMovies = (): SavedMovie[] =>
  useSavedMoviesStore.getState().getSavedMovies();

export const isMovieSaved = async (movieId: number): Promise<boolean> =>
  useSavedMoviesStore.getState().isMovieSaved(movieId);

export default useSavedMoviesStore;
