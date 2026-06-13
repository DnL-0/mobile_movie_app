import { images } from "@/constants/images";
import useAuthStore from "@/services/auth";
import useSavedMoviesStore from "@/services/savedMovies";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const savedCount = useSavedMoviesStore((state) => state.movies.length);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" resizeMode="cover" />

      <View className="flex-1 px-6 pt-16">
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-purple-600 items-center justify-center mb-4 border-2 border-purple-500">
            <Text className="text-white text-3xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{user?.name}</Text>
          <Text className="text-light-200 text-sm mt-1">{user?.email}</Text>
        </View>

        {/* Stats */}
        <View className="bg-dark-100 rounded-2xl p-5 border border-dark-200 mb-6">
          <Text className="text-light-200 text-xs font-semibold uppercase tracking-widest mb-3">
            My Collection
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="bg-purple-600 rounded-xl px-4 py-2">
              <Text className="text-white font-bold text-xl">{savedCount}</Text>
            </View>
            <Text className="text-white font-medium text-base">
              {savedCount === 1 ? "movie saved" : "movies saved"}
            </Text>
          </View>
        </View>

        {/* Account info */}
        <View className="bg-dark-100 rounded-2xl border border-dark-200 mb-6 overflow-hidden">
          <View className="px-5 py-4 border-b border-dark-200">
            <Text className="text-light-300 text-xs mb-1">Full name</Text>
            <Text className="text-white font-medium">{user?.name}</Text>
          </View>
          <View className="px-5 py-4">
            <Text className="text-light-300 text-xs mb-1">Email address</Text>
            <Text className="text-white font-medium">{user?.email}</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          className="bg-dark-100 border border-red-500/40 rounded-2xl py-4 items-center"
        >
          {loggingOut ? (
            <ActivityIndicator color="#f87171" />
          ) : (
            <Text className="text-red-400 font-semibold text-base">
              Sign Out
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
