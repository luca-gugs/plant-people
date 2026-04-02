import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "~convex/_generated/api";

type Mode = "create" | "join";

export default function Setup() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const createHousehold = useMutation(api.households.create);
  const joinHousehold = useMutation(api.households.join);

  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.householdId) return <Redirect href="/(app)/(tabs)" />;

  async function handleCreate() {
    if (!name.trim()) return;
    setError("");
    setLoading(true);
    try {
      await createHousehold({ name: name.trim() });
      router.replace("/(app)/(tabs)");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create household");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (joinCode.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      await joinHousehold({ joinCode });
      router.replace("/(app)/(tabs)");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid join code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-parchment"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center px-6 py-16">
          {/* Header */}
          <Text
            className="text-ink-faint mb-5"
            style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase" }}
          >
            Household Registry
          </Text>

          {/* Icon row */}
          <View className="flex-row items-center mb-5">
            <View className="h-px w-8 bg-border" />
            <View className="mx-4 w-10 h-10 border border-border items-center justify-center">
              <Text className="text-botanical text-lg">⌂</Text>
            </View>
            <View className="h-px w-8 bg-border" />
          </View>

          <Text
            className="text-ink mb-2"
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              fontSize: 32,
              fontWeight: "300",
            }}
          >
            Welcome Home
          </Text>
          <Text
            className="text-ink-faint text-center mb-8"
            style={{ fontSize: 13, fontStyle: "italic" }}
          >
            Establish or enter your household to begin.
          </Text>

          {/* Card */}
          <View className="w-full border border-border bg-white/60 p-6">
            {/* Tabs */}
            <View className="flex-row border-b border-border mb-6">
              <TouchableOpacity
                className="flex-1 pb-3 items-center"
                onPress={() => { setMode("create"); setError(""); }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: mode === "create" ? "#3A4D39" : "#8A8579",
                  }}
                >
                  + Create New
                </Text>
                {mode === "create" && (
                  <View className="absolute bottom-0 left-0 right-0 h-px bg-botanical" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 pb-3 items-center"
                onPress={() => { setMode("join"); setError(""); }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: mode === "join" ? "#3A4D39" : "#8A8579",
                  }}
                >
                  Join Existing
                </Text>
                {mode === "join" && (
                  <View className="absolute bottom-0 left-0 right-0 h-px bg-botanical" />
                )}
              </TouchableOpacity>
            </View>

            {mode === "create" ? (
              <View>
                <Text
                  className="text-ink-faint mb-2"
                  style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}
                >
                  Household Name
                </Text>
                <TextInput
                  className="border-b border-border pb-2.5 text-sm text-ink w-full"
                  style={{ fontStyle: "italic" }}
                  placeholder="e.g. Baker Street Suite"
                  placeholderTextColor="#8A8579"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
                <Text
                  className="text-ink-faint mt-1"
                  style={{ fontSize: 10, fontStyle: "italic" }}
                >
                  Choose a name your residents will recognise.
                </Text>

                <TouchableOpacity
                  className="bg-botanical py-3 items-center mt-6"
                  onPress={handleCreate}
                  disabled={loading || !name.trim()}
                  style={{ opacity: loading || !name.trim() ? 0.5 : 1 }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FBF8F3" />
                  ) : (
                    <Text
                      className="text-parchment"
                      style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}
                    >
                      Establish Household →
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text
                  className="text-ink-faint mb-2"
                  style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}
                >
                  Invitation Code
                </Text>
                <TextInput
                  className="border-b border-border pb-2.5 text-ink text-center w-full"
                  style={{ fontSize: 26, fontFamily: "Courier", letterSpacing: 10 }}
                  placeholder="ABCDEF"
                  placeholderTextColor="#8A8579"
                  maxLength={6}
                  autoCapitalize="characters"
                  value={joinCode}
                  onChangeText={(t) => setJoinCode(t.toUpperCase())}
                  editable={!loading}
                />
                <Text
                  className="text-ink-faint text-center mt-1"
                  style={{ fontSize: 10, fontStyle: "italic" }}
                >
                  Enter the 6-character code from your household steward.
                </Text>

                <TouchableOpacity
                  className="bg-botanical py-3 items-center mt-6"
                  onPress={handleJoin}
                  disabled={loading || joinCode.length !== 6}
                  style={{ opacity: loading || joinCode.length !== 6 ? 0.5 : 1 }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FBF8F3" />
                  ) : (
                    <Text
                      className="text-parchment"
                      style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}
                    >
                      Enter Household →
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {error ? (
              <View className="border border-alert/30 bg-red-50 p-3 mt-4 flex-row">
                <Text className="text-alert text-xs flex-1" style={{ fontStyle: "italic" }}>
                  {error}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Footer */}
          <View className="mt-8 items-center w-full">
            <View className="flex-row items-center w-full mb-5">
              <View className="h-px flex-1 bg-border" />
              <Text
                className="text-ink-faint mx-3"
                style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}
              >
                or
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>
            <TouchableOpacity onPress={() => void signOut()}>
              <Text
                className="text-ink-faint"
                style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}
              >
                ← Sign out of account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
