import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  saveMovie: (movie: SavedMovie) => void;
  removeSavedMovie: (movieId: number) => void;
  getSavedMovies: () => SavedMovie[];
  isMovieSaved: (movieId: number) => boolean;
}

const useSavedMoviesStore = create<SavedMoviesStore>()(
  persist(
    (set, get) => ({
      movies: [],

      saveMovie: (movie: SavedMovie) => {
        const alreadySaved = get().movies.some((m) => m.id === movie.id);
        if (!alreadySaved) {
          set((state) => ({
            movies: [...state.movies, { ...movie, savedAt: Date.now() }],
          }));
        }
      },

      removeSavedMovie: (movieId: number) => {
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== movieId),
        }));
      },

      getSavedMovies: () => get().movies,

      isMovieSaved: (movieId: number) =>
        get().movies.some((m) => m.id === movieId),
    }),
    {
      name: "saved-movies",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const saveMovie = async (movie: SavedMovie) => {
  useSavedMoviesStore.getState().saveMovie(movie);
  return true;
};

export const removeSavedMovie = async (movieId: number) => {
  useSavedMoviesStore.getState().removeSavedMovie(movieId);
  return true;
};

export const getSavedMovies = (): SavedMovie[] => {
  return useSavedMoviesStore.getState().getSavedMovies();
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  return useSavedMoviesStore.getState().isMovieSaved(movieId);
};

export default useSavedMoviesStore;
