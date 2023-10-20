import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Redirect, router } from "expo-router";
import { useSession } from "../context/ctx";

export default function Page() {
  const { session, isLoading } = useSession();

  // This useEffect runs when the component is mounted or whenever session changes.
  useEffect(() => {
    // Check for session or other conditions
    if (!isLoading) {
      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/splash");
      }
    }
  }, [session, isLoading]);

  // While checking session and loading, you can display a loading message.
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // The component should not return anything here, as redirection will be handled in the useEffect.
  return <Slot />;
}
