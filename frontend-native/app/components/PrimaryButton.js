import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

export default function PrimaryButton({ text, onPress, loading }) {
  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <Button
        mode="contained"
        buttonColor="#265AE8"
        style={{
          width: 335,
          padding: 10,
          borderRadius: 6,
        }}
        labelStyle={{
          color: "#FFFFFF",
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
