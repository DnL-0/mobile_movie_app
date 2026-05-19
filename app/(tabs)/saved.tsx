import MovieCard from "@/components/MovieCard";
import { images } from "@/constants/images";
import { getSavedMovies, SavedMovie } from "@/services/savedMovies";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedMovies = async () => {
    try {
      setLoading(true);
      const movies = getSavedMovies();
      setSavedMovies(movies);
    } catch (error) {
      console.error("Error loading saved movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, []),
  );

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex-1 px-5 pt-12">
        <Text className="text-2xl text-white font-bold mb-5">Saved Movies</Text>

        {savedMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-center">
              No saved movies yet. Start saving your favorites!
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => (
              <MovieCard
                id={item.id}
                title={item.title}
                poster_path={undefined}
                poster_url={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : undefined
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="pb-10"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Saved;
