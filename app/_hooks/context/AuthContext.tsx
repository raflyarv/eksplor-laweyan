import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Define types for the context value
type AuthContextType = {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userData: any; // Define a type for your user data as needed
  refetchUserData: () => Promise<void>; // Function to manually refetch user data
};

// Create context with the defined type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null); // State to store user data

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  // Function to fetch user data
  const fetchUserData = async (refreshToken: string) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/user`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
        },
      });
      if (response.status === 200 && response.data) {
        setUserData(response.data); // Store user data in state
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  // Function to refetch user data (can be called from components)
  const refetchUserData = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        await fetchUserData(refreshToken);
      }
    } catch (error) {
      console.error("Failed to refetch user data:", error);
    }
  };

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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData, refetchUserData }}
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
