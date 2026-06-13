import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useAuthStore from "@/services/auth";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signup, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Sign up failed. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="items-center mb-10">
            <Image source={icons.logo} className="w-16 h-14 mb-4" />
            <Text className="text-3xl font-bold text-white">Create account</Text>
            <Text className="text-light-200 mt-2 text-base">
              Join to save your favourite movies
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-light-200 text-sm mb-2 font-medium">
                Full Name
              </Text>
              <TextInput
                className="bg-dark-100 text-white rounded-xl px-4 py-4 text-base border border-dark-200"
                placeholder="John Doe"
                placeholderTextColor="#A8B5DB"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-light-200 text-sm mb-2 font-medium">
                Email
              </Text>
              <TextInput
                className="bg-dark-100 text-white rounded-xl px-4 py-4 text-base border border-dark-200"
                placeholder="you@example.com"
                placeholderTextColor="#A8B5DB"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-light-200 text-sm mb-2 font-medium">
                Password
              </Text>
              <TextInput
                className="bg-dark-100 text-white rounded-xl px-4 py-4 text-base border border-dark-200"
                placeholder="Min. 8 characters"
                placeholderTextColor="#A8B5DB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? (
              <Text className="text-red-400 text-sm text-center">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className="bg-purple-600 rounded-xl py-4 items-center mt-2"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8 gap-1">
            <Text className="text-light-200">Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-purple-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
