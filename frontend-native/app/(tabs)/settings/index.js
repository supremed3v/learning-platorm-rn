import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: "true", title: "Settings" }} />
      <View>
        <Text>Settings Page</Text>
      </View>
    </>
  );
}
