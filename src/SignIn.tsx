import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";

type EmailForm = { email: string };
type CodeForm = { code: string };

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");

  const emailForm = useForm<EmailForm>();
  const codeForm = useForm<CodeForm>();

  // Step 1: Send the OTP code to the user's email
  async function handleSendCode({ email }: EmailForm) {
    setError("");
    try {
      await signIn("resend-otp", { email });
      setStep("code");
    } catch {
      setError("Failed to send code. Check your email and try again.");
    }
  }

  // Step 2: Verify the OTP code — ConvexAuthProvider handles the rest on success
  async function handleVerify({ code }: CodeForm) {
    setError("");
    try {
      await signIn("resend-otp", { email: emailForm.getValues("email"), code });
    } catch {
      setError("Invalid code. Please try again.");
    }
  }

  return (
    <div>
      <h1>Plant People</h1>

      {step === "email" ? (
        <form onSubmit={(e) => void emailForm.handleSubmit(handleSendCode)(e)}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...emailForm.register("email", { required: true })}
          />
          <button type="submit" disabled={emailForm.formState.isSubmitting}>
            {emailForm.formState.isSubmitting ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => void codeForm.handleSubmit(handleVerify)(e)}>
          <p>Enter the 8-digit code sent to {emailForm.getValues("email")}</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            autoFocus
            {...codeForm.register("code", {
              required: true,
              pattern: /^[0-9]*$/,
            })}
          />
          <button type="submit" disabled={codeForm.formState.isSubmitting}>
            {codeForm.formState.isSubmitting ? "Verifying..." : "Verify"}
          </button>
          {/* Go back if they entered the wrong email */}
          <button
            type="button"
            onClick={() => {
              setStep("email");
              codeForm.reset();
              setError("");
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}
