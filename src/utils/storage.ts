import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
const isServer = typeof window === "undefined";

export function useLocalStorage<T>(
  key: string,
  defaultState?: T
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const state = useState<T | undefined>(() => defaultState);

  const initialize = () => {
    try {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value) as T;
    } catch (error: any) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }

    return defaultState;
  };
  useEffect(() => {
    if (!isServer) {
      state[1](initialize());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = state[0];

  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error: any) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }
  }, [value, key]);

  return state;
}
