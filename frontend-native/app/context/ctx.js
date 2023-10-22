import React, { useEffect } from "react";
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
  const [user, setUser] = React.useState(null);
  const [courses, setCourses] = React.useState(null);

  const signIn = async (email, password) => {
    try {
      setValue([true, token]);

      const response = await axios.post(
        "https://sore-lion-scarf.cyclic.app/api/v1/login",
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "https://sore-lion-scarf.cyclic.app/api/v1/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Get user error:", error.message);
      }
    };

    token !== null && getUser();
  }, [token]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get(
          "https://sore-lion-scarf.cyclic.app/api/v1/course"
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Get courses error:", error.message);
      }
    };

    getCourses();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading, // Use `isLoading` from useStorageState
        session: token ? token[1] : null,
        signIn,
        signOut,
        apiResponse,
        token,
        user,
        courses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
