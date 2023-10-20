import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
export default function CustomButton({ text, onPress, loading, bg, icon }) {
  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <Button
        mode="contained"
        buttonColor={bg}
        style={{
          width: 335,
          padding: 10,
          borderRadius: 6,
        }}
        labelStyle={{
          color: "#0B121F",
          fontSize: 18,
        }}
        icon={icon}
        onPress={onPress ? onPress : null}
        disabled={loading ? true : false}
      >
        {text}
      </Button>
    </View>
  );
}
