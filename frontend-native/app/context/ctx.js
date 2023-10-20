import React from "react";
import { useStorageState } from "./useStateStorage";
import axios from "axios";

const AuthContext = React.createContext();

export function useSession() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [apiResponse, setApiResponse] = React.useState(null);

  const signIn = async (email, password) => {
    try {
      // Set isLoading to true during sign-in
      setSession([true, session]);

      const response = await axios.post(
        "http://192.168.18.8:8000/api/v1/login",
        {
          email,
          password,
        }
      );
      setApiResponse(response.data.user);
      setSession([false, response.data.token]); // Reset isLoading after successful sign-in
    } catch (error) {
      console.error("Sign-in error:", error);

      // Ensure that isLoading is reset even in case of an error
      setSession([false, session]);
    }
  };

  const signOut = () => {
    try {
      // Set isLoading to true during sign-out
      setSession([true, session]);

      // Perform sign-out operations, and then reset isLoading
      setSession([false, null]);
    } catch (error) {
      console.error(error);

      // Ensure that isLoading is reset even in case of an error
      setSession([false, session]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        signIn,
        signOut,
        apiResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
