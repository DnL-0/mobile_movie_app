import MovieCard from "@/components/MovieCard";
import { images } from "@/constants/images";
import useSavedMoviesStore from "@/services/savedMovies";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    View
} from "react-native";

const Saved = () => {
  const savedMovies = useSavedMoviesStore((state) => state.movies);
  const [hydrated, setHydrated] = useState(
    useSavedMoviesStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useSavedMoviesStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);

  if (!hydrated) {
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
              <MovieCard {...(item as unknown as Movie)} />
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

export default Saved;
