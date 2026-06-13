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
        {/* Backdrop Image with Overlay */}
        <View className="relative">
          <Image
            source={{
              uri: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                : "https://placehold.co/600x400/1a1a1a/ffffff.png",
            }}
            className="w-full h-72"
            resizeMode="cover"
          />

          {/* Dark Overlay */}
          <View className="absolute inset-0 bg-black/40" />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-5 bg-black/60 rounded-full p-3"
          >
            <Text className="text-light-100 text-xl font-bold">←</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 pb-10">
          {/* Poster and Title Section */}
          <View className="flex-row gap-5 -mt-20 mb-6 relative z-10">
            <View className="rounded-2xl overflow-hidden bg-dark-100 border border-dark-100 shadow-lg">
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                }}
                className="w-32 h-48 rounded-2xl"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 justify-end pb-2">
              <Text
                className="text-2xl text-white font-bold leading-tight mb-3"
                numberOfLines={4}
              >
                {movie.title}
              </Text>

              <Text className="text-light-200 text-sm font-medium mb-3">
                {movie.release_date?.split("-")[0] || "N/A"}
              </Text>

              {/* Rating Badge */}
              <View className="flex-row items-center gap-2 mb-4 bg-dark-100 rounded-full px-3 py-2 w-fit border border-dark-100">
                <Image source={icons.star} className="w-5 h-5" />
                <Text className="text-light-100 font-bold text-lg">
                  {(movie.vote_average / 2).toFixed(1)}
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveMovie}
                disabled={isSaving}
                className={`rounded-xl px-4 py-3 ${
                  isSaved
                    ? "bg-purple-600"
                    : "bg-purple-600 opacity-70 border border-purple-500"
                }`}
              >
                <Text className="text-white text-sm font-bold text-center">
                  {isSaving
                    ? "Saving..."
                    : isSaved
                      ? "✓ Saved to Collection"
                      : "+ Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overview Section */}
          {movie.overview && (
            <View className="mb-6">
              <Text className="text-lg text-light-100 font-bold mb-3">
                Synopsis
              </Text>
              <View className="bg-dark-100 rounded-xl p-4 border border-dark-100">
                <Text className="text-light-200 leading-7 text-sm">
                  {movie.overview}
                </Text>
              </View>
            </View>
          )}

          {/* Genres Section */}
          {movie.genres && movie.genres.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg text-light-100 font-bold mb-3">
                Genres
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {movie.genres.map((genre: any) => (
                  <View
                    key={genre.id}
                    className="bg-purple-600 bg-opacity-30 px-4 py-2 rounded-full border border-purple-500 border-opacity-40"
                  >
                    <Text className="text-light-100 text-sm font-medium">
                      {genre.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Info Cards Section */}
          <View className="gap-3 mb-6">
            {movie.runtime && (
              <View className="bg-dark-100 rounded-xl p-4 border border-dark-100 flex-row justify-between items-center">
                <Text className="text-light-200 text-sm font-medium">
                  Runtime
                </Text>
                <Text className="text-light-100 font-bold text-base">
                  {movie.runtime} min
                </Text>
              </View>
            )}

            {movie.budget > 0 && (
              <View className="bg-dark-100 rounded-xl p-4 border border-dark-100 flex-row justify-between items-center">
                <Text className="text-light-200 text-sm font-medium">
                  Budget
                </Text>
                <Text className="text-light-100 font-bold text-base">
                  ${(movie.budget / 1000000).toFixed(1)}M
                </Text>
              </View>
            )}

            {movie.revenue > 0 && (
              <View className="bg-dark-100 rounded-xl p-4 border border-dark-100 flex-row justify-between items-center">
                <Text className="text-light-200 text-sm font-medium">
                  Revenue
                </Text>
                <Text className="text-light-100 font-bold text-base">
                  ${(movie.revenue / 1000000).toFixed(1)}M
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
