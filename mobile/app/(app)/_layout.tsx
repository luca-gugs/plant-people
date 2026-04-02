import { useConvexAuth } from "convex/react";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-parchment">
        <ActivityIndicator color="#3A4D39" size="large" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="setup"
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="plant-box/[id]"
        options={{
          headerShown: true,
          headerTitle: "Station",
          headerStyle: { backgroundColor: "#FBF8F3" },
          headerTintColor: "#3A4D39",
          headerTitleStyle: {
            fontFamily: "Georgia",
            fontStyle: "italic",
            fontWeight: "300",
          },
          headerShadowVisible: false,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
