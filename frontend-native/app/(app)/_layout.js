import { useEffect } from "react";
import { useSession } from "../context/ctx";
import { Redirect, Stack, router } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (session !== null) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/signin");
        }
      }, 2000);

      return () => {
        clearTimeout();
      };
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
