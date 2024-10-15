// app/(no-auth)/_layout.tsx

import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../_hooks/context/AuthContext";
import { UserLocationProvider } from "../_hooks/context/UserLocationContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth(); // Get the isAuthenticated status
  const router = useRouter(); // Get router for navigation

  useEffect(() => {
    // If the user is not authenticated, redirect to the no-auth/login page
    if (isAuthenticated === false) {
      router.replace("/(no-auth)/login");
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    // Return null or a loading screen while checking authentication
    return null;
  }

  if (isAuthenticated === false) {
    // Prevent rendering the tabs if the user is not authenticated
    return null;
  }

  return (
    <UserLocationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="details/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="details/reviews"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/edit-profile"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="scan-qr/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserLocationProvider>
  );
}
