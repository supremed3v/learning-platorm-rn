import { View } from "react-native";
import React, { useEffect } from "react";
import { Text, TextInput } from "react-native-paper";
import PrimaryButton from "../../components/PrimaryButton";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useSession } from "../../context/ctx";

export default function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { signIn, session, isLoading, apiResponse } = useSession();
  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      // Wait for the signIn function to complete

      if (session !== null && apiResponse !== null) {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      // Handle sign-in errors here.
      console.error("Sign-in error:", error);
    }
  };

  useEffect(() => {
    // Check the session state after the component has mounted
    console.log("Session state:", session);
  }, [session]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Text variant="displaySmall">Welcome back!</Text>
        <Text variant="displaySmall">Sign in to continue</Text>
      </View>
      <View
        style={{
          alignItems: "center",
          width: 335,
          marginVertical: 10,
        }}
      >
        <CustomButton
          text="Continue with Google"
          bg="#EDEEF0"
          icon={"google"}
        />
        <CustomButton
          text="Continue with Facebook"
          bg="#EDEEF0"
          icon={"facebook"}
        />
      </View>
      <Text variant="titleMedium">or</Text>
      <View>
        <TextInput
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          style={{
            width: 335,
            marginVertical: 10,
            backgroundColor: "#eee",
          }}
          outlineColor="transparent"
          activeOutlineColor="#ccc"
          error={email.length > 0 && !email.includes("@")}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          style={{
            width: 335,
            marginVertical: 10,
            backgroundColor: "#eee",
          }}
          outlineColor="transparent"
          activeOutlineColor="#ccc"
          error={password.length < 0}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <PrimaryButton
        text="Login"
        onPress={() => handleSignIn()}
        loading={isLoading === true ? true : false}
      />
    </View>
  );
}
