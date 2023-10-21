import { View, StatusBar } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Avatar, Text, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../context/ctx";
import axios from "axios";

export default function Home() {
  const handleBack = () => {
    router.replace("/splash");
  };

  const [searchQ, setSearchQ] = React.useState("");

  const { user } = useSession();

  const trimName = (name) => {
    return name.split(" ")[0];
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView />
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Text
            variant="headlineLarge"
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >{`Hola, ${trimName(user.name)}`}</Text>
          <View>
            <Avatar.Image size={40} source={{ uri: user.avatar.url }} />
          </View>
        </View>
        <View>
          <Text
            style={{
              color: "#70747E",
            }}
          >
            What do you wanna learn today?
          </Text>
        </View>
        <View>
          <Searchbar
            placeholder="Search for courses"
            onChangeText={(text) => setSearchQ(text)}
            value={searchQ}
            style={{
              marginTop: 20,
              borderRadius: 8,
              backgroundColor: "#FFF1F3",
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingVertical: 30,
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              color: "#282F3E",
              width: 240,
              fontWeight: "500",
              letterSpacing: 0.5,
            }}
          >
            Popular category in our platform
          </Text>
          <Text
            style={{
              color: "#70747E",
            }}
            variant="labelSmall"
          >
            see more
          </Text>
        </View>
      </View>
    </>
  );
}
