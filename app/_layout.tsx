import useAuthStore from "@/services/auth";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./globals.css";

function AuthGuard() {
  const { user, initialized, init } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, initialized, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden />
      <AuthGuard />
    </>
  );
}
