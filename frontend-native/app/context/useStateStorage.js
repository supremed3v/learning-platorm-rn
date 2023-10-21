import * as SecureStore from "expo-secure-store";
import * as React from "react";

function useAsyncState(initialValue = [false, null]) {
  const [state, setState] = React.useState(initialValue);

  const setAsyncState = (value) => {
    return new Promise((resolve, reject) => {
      setState(value);
      resolve(value);
    });
  };

  return [state, setAsyncState];
}

export async function setStorageItemAsync(key, value) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    const serializedValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, serializedValue);
  }
}

export function useStorageState(key) {
  const [state, setState] = useAsyncState();

  const [loading, setLoading] = React.useState(true); // Add loading state

  React.useEffect(() => {
    SecureStore.getItemAsync(key)
      .then((value) => {
        if (value) {
          const deserializedValue = JSON.parse(value);
          console.log("Retrieved value from SecureStore:", deserializedValue);
          setState(deserializedValue);
        }
      })
      .catch((error) => {
        console.error("Error while retrieving from SecureStore:", error);
      })
      .finally(() => {
        setLoading(false); // Update loading state whether successful or not
      });
  }, [key]);

  const setValue = React.useCallback(
    (value) => {
      return setStorageItemAsync(key, value)
        .then(() => {
          console.log("Value saved to SecureStore:", value);
          return setState(value);
        })
        .catch((error) => {
          console.error("Error while saving to SecureStore:", error);
        });
    },
    [key]
  );

  const isTokenAvailable = state[0];
  const token = state[1];

  console.log("Is token available:", isTokenAvailable);
  console.log("Current token:", token);

  return { token, isTokenAvailable, setValue, loading };
}
