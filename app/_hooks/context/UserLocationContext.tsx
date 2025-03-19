// UserLocationProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UserLocationContextType {
  currentLocation: Coordinates | null;
  errorMsg: string | null;
}

const UserLocationContext = createContext<UserLocationContextType | undefined>(
  undefined
);

export const UserLocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude,
        longitude,
      });
    })();
  }, []);

  return (
    <UserLocationContext.Provider value={{ currentLocation, errorMsg }}>
      {children}
    </UserLocationContext.Provider>
  );
};

// Custom hook to use the UserLocation context
export const useUserLocation = () => {
  const context = useContext(UserLocationContext);
  if (context === undefined) {
    throw new Error(
      "useUserLocation must be used within a UserLocationProvider"
    );
  }
  return context;
};
