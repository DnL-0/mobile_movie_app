// track the searches made by a user

import { databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: string | number;
  title: string;
  poster_path?: string;
  poster_url?: string;
  [key: string]: any;
}

interface TrendingMovie {
  movie_id: number;
  title: string;
  poster_url: string;
  count: number;
  $id: string;
}

const buildPosterUrl = (movie: Movie): string => {
  // If poster_url already exists as a full URL, use it
  if (movie.poster_url && movie.poster_url.startsWith("http")) {
    return movie.poster_url;
  }

  // If poster_path exists (from TMDB), build the full URL
  if (movie.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
  }

  // Fallback to a placeholder
  return "https://via.placeholder.com/500x750?text=No+Poster";
};

export const updateSearchCount = async (searchTerm: string, movie?: Movie) => {
  if (!searchTerm.trim() || !movie) return;

  try {
    // Check if a record with this search term already exists
    const existingResults = await databases.listDocuments(
      DATABASE_ID!,
      COLLECTION_ID!,
      [Query.equal("searchTerm", searchTerm)],
    );

    if (existingResults.documents.length > 0) {
      // Document exists, increment the count
      const existingDoc = existingResults.documents[0];
      const newCount = (existingDoc.count || 0) + 1;

      await databases.updateDocument(
        DATABASE_ID!,
        COLLECTION_ID!,
        existingDoc.$id,
        {
          count: newCount,
        },
      );
      console.log(`Updated search count for "${searchTerm}" to ${newCount}`);
    } else {
      // New search term, create a new document
      await databases.createDocument(
        DATABASE_ID!,
        COLLECTION_ID!,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          poster_url: buildPosterUrl(movie),
          movie_id: Number(movie.id),
          title: movie.title || "",
        },
      );
      console.log(`Created new search metric for "${searchTerm}"`);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID!,
      COLLECTION_ID!,
      [Query.orderDesc("count"), Query.limit(10)]
    );

    return response.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};