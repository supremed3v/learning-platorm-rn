import { View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import React from "react";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
