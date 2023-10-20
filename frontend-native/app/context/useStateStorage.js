import * as SecureStore from "expo-secure-store";
import * as React from "react";

function useAsyncState(initialValue = [false, null]) {
  return React.useReducer(
    (state, action = null) => [false, action],
    initialValue
  );
}

export async function setStorageItemAsync(key, value) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key) {
  const [state, setState] = useAsyncState();

  React.useEffect(() => {
    // Retrieve the data from SecureStore and update the state
    SecureStore.getItemAsync(key)
      .then((value) => {
        console.log("Retrieved value from SecureStore:", value);
        setState(value);
      })
      .catch((error) => {
        console.error("Error while retrieving from SecureStore:", error);
      });
  }, [key]);

  const setValue = React.useCallback(
    (value) => {
      setStorageItemAsync(key, value)
        .then(() => {
          console.log("Value saved to SecureStore:", value);
          setState(value);
        })
        .catch((error) => {
          console.error("Error while saving to SecureStore:", error);
        });
    },
    [key]
  );

  console.log("Current session state:", state);

  return [state, setValue];
}
