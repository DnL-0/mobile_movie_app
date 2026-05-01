import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({
  id,
  poster_path,
  poster_url,
  title,
  vote_average,
  release_date,
  ranking,
}: Movie & { poster_url?: string; ranking?: number }) => {
  const imageUri =
    poster_url ||
    (poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : "https://placehold.co/600x400/1a1a1a/ffffff.png");

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[30%] relative">
        <Image
          source={{
            uri: imageUri,
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        {ranking && (
          <View className="absolute bottom-0 left-0 bg-purple-500 rounded-tr-lg px-2 py-1">
            <Text className="text-white font-bold text-sm">#{ranking}</Text>
          </View>
        )}

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        {vote_average && (
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>
        )}

        {release_date && (
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
