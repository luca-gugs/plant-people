import { useQuery } from "convex/react";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { api } from "~convex/_generated/api";

export default function TabsLayout() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-parchment">
        <ActivityIndicator color="#3A4D39" size="large" />
      </View>
    );
  }

  if (!user?.householdId) return <Redirect href="/(app)/setup" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FBF8F3",
          borderTopColor: "#D9CFC0",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#3A4D39",
        tabBarInactiveTintColor: "#8A8579",
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Garden",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⬡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⚙</Text>
          ),
        }}
      />
    </Tabs>
  );
}
