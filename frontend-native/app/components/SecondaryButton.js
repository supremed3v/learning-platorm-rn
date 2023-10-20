import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

export default function SecondaryButton({ text, onPress, loading }) {
  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <Button
        mode="contained"
        buttonColor="#FFFFFF"
        style={{
          width: 300,
          padding: 10,
          borderColor: "#265AE8",
          borderWidth: 1,
        }}
        labelStyle={{
          color: "#265AE8",
          fontSize: 18,
        }}
        onPress={onPress}
        disabled={loading ? true : false}
      >
        {text}
      </Button>
    </View>
  );
}
