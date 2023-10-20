import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import PrimaryButton from "./components/PrimaryButton";
import SecondaryButton from "./components/SecondaryButton";
import { Image } from "react-native";
import { carouselContent } from "../assets/dummyData";

export default function Page() {
  const handleLogin = () => {
    router.replace("/(auth)/signin");
  };
  const handleSignup = () => {
    router.replace("/(tabs)/home");
  };

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleCarousel = (index) => {
    setActiveIndex(index);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselContent.length);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {carouselContent.map((item, index) => {
        return (
          <View
            style={{
              display: index === activeIndex ? "flex" : "none",
            }}
            key={index}
          >
            <View
              style={{
                marginVertical: 20,
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={item.image} />
            </View>

            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 5,
              }}
            >
              <Text
                variant="displaySmall"
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {item.title}
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  textAlign: "center",
                  fontWeight: "400",
                  color: "#9FA3A9",
                }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        );
      })}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {carouselContent.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: index === activeIndex ? 12 : 6,
              height: index === activeIndex ? 12 : 6,
              borderRadius: 6,
              backgroundColor: index === activeIndex ? "#000000" : "#9FA3A9",
              margin: 6,
            }}
            onPress={() => handleCarousel(index)}
          />
        ))}
      </View>
      <View
        style={{
          paddingTop: 10,
        }}
      />
      <PrimaryButton text="Signup" onPress={handleSignup} loading={false} />
      <SecondaryButton text="Login" onPress={handleLogin} loading={false} />
    </View>
  );
}
