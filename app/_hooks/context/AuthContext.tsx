import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

// Define types for the context value
type AuthContextType = {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userData: any; // Define a type for your user data as needed
};

// Create context with the defined type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null); // State to store user data

  useEffect(() => {
    const checkToken = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          setIsAuthenticated(true);
          await fetchUserData(refreshToken); // Fetch user data using the refresh token
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  // Function to fetch user data
  const fetchUserData = async (refreshToken: string) => {
    try {
      const response = await axios.get(
        "http://192.168.100.18:5000/api/user/user",
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
          },
        }
      );
      if (response.status === 200 && response.data) {
        setUserData(response.data); // Store user data in state
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
