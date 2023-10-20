import { View, Text } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Button } from "react-native-paper";

export default function Home() {
  const handleBack = () => {
    router.replace("/splash");
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: "true", title: "Home" }} />
      <View>
        <Text>Home Page</Text>
        <Button mode="elevated" onPress={handleBack}>
          <Text>Back to splash</Text>
        </Button>
      </View>
    </>
  );
}
