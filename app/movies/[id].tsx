import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import {
    isMovieSaved,
    removeSavedMovie,
    saveMovie,
} from "@/services/savedMovies";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const details = await fetchMovieDetails(id);
        setMovie(details);

        const saved = await isMovieSaved(Number(id));
        setIsSaved(saved);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovie();
    }
  }, [id]);

  const handleSaveMovie = async () => {
    if (!movie) return;

    try {
      setIsSaving(true);

      if (isSaved) {
        await removeSavedMovie(movie.id);
        setIsSaved(false);
      } else {
        await saveMovie({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error saving movie:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Text className="text-white text-center">
          {error || "Movie not found"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        <View className="relative">
          <Image
            source={{
              uri: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                : "https://placehold.co/600x400/1a1a1a/ffffff.png",
            }}
            className="w-full h-64"
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 bg-black/50 rounded-full p-2"
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 pb-10">
          {/* Poster and Title */}
          <View className="flex-row mt-4 gap-4">
            <Image
              source={{
                uri: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://placehold.co/600x400/1a1a1a/ffffff.png",
              }}
              className="w-28 h-44 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 justify-start pt-2">
              <Text className="text-lg text-white font-bold" numberOfLines={3}>
                {movie.title}
              </Text>
              <Text className="text-sm text-gray-400 mt-2">
                {movie.release_date?.split("-")[0]}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center gap-2 mt-2">
                <Image source={icons.star} className="w-4 h-4" />
                <Text className="text-yellow-400 font-bold">
                  {(movie.vote_average / 2).toFixed(1)}
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveMovie}
                disabled={isSaving}
                className={`mt-4 px-3 py-2 rounded-lg ${
                  isSaved ? "bg-purple-600" : "bg-gray-700"
                }`}
              >
                <Text className="text-white text-sm font-bold text-center">
                  {isSaving ? "Loading..." : isSaved ? "✓ Saved" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overview */}
          {movie.overview && (
            <View className="mt-6">
              <Text className="text-lg text-white font-bold mb-2">
                Overview
              </Text>
              <Text className="text-gray-300 leading-6">{movie.overview}</Text>
            </View>
          )}

          {/* Additional Info */}
          <View className="mt-6 gap-4">
            {movie.genres && movie.genres.length > 0 && (
              <View>
                <Text className="text-lg text-white font-bold mb-2">
                  Genres
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <View
                      key={genre.id}
                      className="bg-gray-700 px-3 py-1 rounded-full"
                    >
                      <Text className="text-gray-200 text-xs">
                        {genre.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {movie.runtime && (
              <View>
                <Text className="text-gray-400 text-sm">
                  Runtime:{" "}
                  <Text className="text-white font-bold">
                    {movie.runtime} minutes
                  </Text>
                </Text>
              </View>
            )}

            {movie.budget > 0 && (
              <View>
                <Text className="text-gray-400 text-sm">
                  Budget:{" "}
                  <Text className="text-white font-bold">
                    ${(movie.budget / 1000000).toFixed(1)}M
                  </Text>
                </Text>
              </View>
            )}

            {movie.revenue > 0 && (
              <View>
                <Text className="text-gray-400 text-sm">
                  Revenue:{" "}
                  <Text className="text-white font-bold">
                    ${(movie.revenue / 1000000).toFixed(1)}M
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MovieDetails;
