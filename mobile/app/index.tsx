import { useConvexAuth, useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { api } from "~convex/_generated/api";

export default function Index() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading || (isAuthenticated && user === undefined)) {
    return (
      <View className="flex-1 items-center justify-center bg-parchment">
        <ActivityIndicator color="#3A4D39" size="large" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  if (!user?.householdId) return <Redirect href="/(app)/setup" />;
  return <Redirect href="/(app)/(tabs)" />;
}
