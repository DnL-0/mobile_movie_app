import { create } from "zustand";

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

const useSavedMoviesStore = create<SavedMoviesStore>((set, get) => ({
  movies: [],

  saveMovie: (movie: SavedMovie) => {
    const state = get();
    const alreadySaved = state.movies.some((m) => m.id === movie.id);

    if (!alreadySaved) {
      set({
        movies: [...state.movies, { ...movie, savedAt: Date.now() }],
      });
    }
  },

  removeSavedMovie: (movieId: number) => {
    const state = get();
    set({
      movies: state.movies.filter((m) => m.id !== movieId),
    });
  },

  getSavedMovies: () => {
    return get().movies;
  },

  isMovieSaved: (movieId: number) => {
    return get().movies.some((m) => m.id === movieId);
  },
}));

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
