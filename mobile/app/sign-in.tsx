import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Redirect } from "expo-router";
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
import { Controller, useForm } from "react-hook-form";

type EmailForm = { email: string };
type CodeForm = { code: string };

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");

  const emailForm = useForm<EmailForm>();
  const codeForm = useForm<CodeForm>();

  if (isAuthenticated) return <Redirect href="/(app)/(tabs)" />;

  async function handleSendCode({ email }: EmailForm) {
    setError("");
    try {
      await signIn("resend-otp", { email });
      setStep("code");
    } catch {
      setError("Failed to send code. Check your email and try again.");
    }
  }

  async function handleVerify({ code }: CodeForm) {
    setError("");
    try {
      await signIn("resend-otp", {
        email: emailForm.getValues("email"),
        code,
      });
    } catch {
      setError("Invalid code. Please try again.");
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
        <View className="flex-1 items-center justify-center px-8 py-16 min-h-screen">
          {/* Wordmark */}
          <Text
            className="text-ink-faint mb-3 text-xs"
            style={{ letterSpacing: 5, textTransform: "uppercase" }}
          >
            Plant People
          </Text>

          {/* Title */}
          <Text
            className="text-botanical mb-2"
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              fontSize: 44,
              fontWeight: "300",
              lineHeight: 52,
            }}
          >
            sign in
          </Text>

          {/* Hairline divider */}
          <View className="w-8 h-px bg-border mb-10" />

          {step === "email" ? (
            <View className="w-full">
              <Text
                className="text-ink-faint mb-2"
                style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}
              >
                Email Address
              </Text>
              <Controller
                control={emailForm.control}
                name="email"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border-b border-border pb-3 text-sm text-ink w-full"
                    style={{ fontStyle: "italic" }}
                    placeholder="you@example.com"
                    placeholderTextColor="#8A8579"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <TouchableOpacity
                className="border border-botanical py-3 px-10 mt-8 items-center self-center"
                onPress={emailForm.handleSubmit(handleSendCode)}
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? (
                  <ActivityIndicator size="small" color="#3A4D39" />
                ) : (
                  <Text
                    className="text-botanical"
                    style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}
                  >
                    Send Code
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-full items-center">
              <Text
                className="text-ink-faint text-center mb-6"
                style={{ fontSize: 14, fontStyle: "italic", lineHeight: 22 }}
              >
                Enter the 8-digit code sent to{"\n"}
                <Text style={{ fontStyle: "normal", color: "#2C2C2C" }}>
                  {emailForm.getValues("email")}
                </Text>
              </Text>

              <Text
                className="text-ink-faint mb-2 self-start"
                style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}
              >
                Verification Code
              </Text>
              <Controller
                control={codeForm.control}
                name="code"
                rules={{ required: true, pattern: /^[0-9]*$/ }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border-b border-border pb-3 text-ink text-center w-full"
                    style={{ fontSize: 28, fontFamily: "Courier", letterSpacing: 12 }}
                    placeholder="00000000"
                    placeholderTextColor="#8A8579"
                    keyboardType="number-pad"
                    maxLength={8}
                    autoFocus
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <TouchableOpacity
                className="border border-botanical py-3 px-10 mt-8 items-center self-center"
                onPress={codeForm.handleSubmit(handleVerify)}
                disabled={codeForm.formState.isSubmitting}
              >
                {codeForm.formState.isSubmitting ? (
                  <ActivityIndicator size="small" color="#3A4D39" />
                ) : (
                  <Text
                    className="text-botanical"
                    style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}
                  >
                    Verify
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-5"
                onPress={() => {
                  setStep("email");
                  codeForm.reset();
                  setError("");
                }}
              >
                <Text
                  className="text-ink-faint"
                  style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}
                >
                  Use a different email
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {error ? (
            <Text
              className="mt-6 text-alert text-center"
              style={{ fontSize: 14, fontStyle: "italic" }}
            >
              {error}
            </Text>
          ) : null}

          {/* Footer */}
          <View className="mt-16 items-center opacity-40">
            <View className="w-8 h-px bg-botanical mb-3" />
            <Text
              className="text-botanical"
              style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase" }}
            >
              Secure Environment
            </Text>
            <View className="w-8 h-px bg-botanical mt-3" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
