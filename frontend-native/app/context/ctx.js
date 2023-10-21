import React from "react";
import axios from "axios";
import { useStorageState } from "./useStateStorage";

const AuthContext = React.createContext();

export function useSession() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }) {
  const { token, isTokenAvailable, setValue, isLoading } =
    useStorageState("session"); // Get `isLoading`

  const [apiResponse, setApiResponse] = React.useState(null);

  const signIn = async (email, password) => {
    try {
      setValue([true, token]);

      const response = await axios.post(
        "http://192.168.18.8:8000/api/v1/login",
        {
          email,
          password,
        }
      );
      setApiResponse(response.data.user);
      setValue([false, response.data.token]);
    } catch (error) {
      console.error("Sign-in error:", error);
      setValue([false, token]);
    }
  };

  const signOut = () => {
    setValue([false, null]);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading, // Use `isLoading` from useStorageState
        session: token ? token[1] : null,
        signIn,
        signOut,
        apiResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
