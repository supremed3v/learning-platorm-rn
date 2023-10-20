import { View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import React from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "./context/ctx";

export default function RootLayout() {
  return (
    <SessionProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </SessionProvider>
  );
}
