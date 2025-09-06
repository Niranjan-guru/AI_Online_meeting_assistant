'use client';

import { useState, useEffect, useCallback } from 'react';

// This hook is designed to be safe for server-side rendering (SSR) environments like Next.js.
// It avoids accessing `window` or `localStorage` on the server.
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // A function to read the value from localStorage, which will only be executed on the client.
  const readValue = useCallback((): T => {
    // Prevent build errors by checking for window and ensuring we are on client
    if (typeof window === 'undefined' || !isClient) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key, isClient]);

  // State to store our value. We pass a function to useState so it only runs once.
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // The setValue function that will update the state and localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    // Prevent build errors by checking for window
    if (typeof window === 'undefined' || !isClient) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));
      // Save state
      setStoredValue(newValue);
      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error)
 {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // Read latest value from localStorage on mount
  useEffect(() => {
    if (isClient) {
      setStoredValue(readValue());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // Effect to handle changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      if (isClient) {
        setStoredValue(readValue());
      }
    };

    // 'storage' event is for changes in other documents (tabs),
    // 'local-storage' is for changes in the same document.
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue, isClient]);
  
  const clientSafeValue = isClient ? storedValue : initialValue;

  return [clientSafeValue, setValue];
}
