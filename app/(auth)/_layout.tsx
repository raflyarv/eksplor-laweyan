// app/(no-auth)/_layout.tsx

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
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
  );
}
