import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Navigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import DailyQuote from "../../components/daily-quote";

type EmailForm = { email: string };
type CodeForm = { code: string };

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();
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

  // Step 2: Verify the OTP code
  async function handleVerify({ code }: CodeForm) {
    setError("");
    try {
      await signIn("resend-otp", { email: emailForm.getValues("email"), code });
    } catch {
      setError("Invalid code. Please try again.");
    }
  }

  // Already signed in — redirect to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-parchment font-body selection:bg-selection">
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ maxWidth: "360px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        {/* Botanical illustration */}
        <motion.div
          className="w-40 md:w-56"
          style={{ height: "260px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img
            src="/california-poppy-branch.png"
            alt="California Poppy"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-6xl font-light italic text-ink mt-2 mb-8"
          style={{ letterSpacing: "-0.03em", lineHeight: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
        >
          sign in
        </motion.h1>

        {/* Hairline divider */}
        <motion.div
          className="mb-10 bg-border"
          style={{ width: "32px", height: "1px" }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        />

        {/* Form — AnimatePresence swaps between email and code steps */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email"
                onSubmit={(e) => void emailForm.handleSubmit(handleSendCode)(e)}
                className="flex flex-col items-center gap-6 w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="w-full text-left">
                  <label htmlFor="email" className="label-xs block mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent border-b border-border pb-2.5 text-sm italic text-ink caret-botanical placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                    {...emailForm.register("email", { required: true })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-outline-botanical"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting
                    ? "Sending\u2026"
                    : "Send code"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="code"
                onSubmit={(e) => void codeForm.handleSubmit(handleVerify)(e)}
                className="flex flex-col items-center gap-6 w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-muted-italic text-sm">
                  Enter the 8-digit code sent to{" "}
                  <strong className="font-normal not-italic text-ink">
                    {emailForm.getValues("email")}
                  </strong>
                </p>

                <div className="w-full text-left">
                  <label htmlFor="code" className="label-xs block mb-2">
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    autoFocus
                    placeholder="00000000"
                    className="w-full bg-transparent border-b border-border pb-2.5 text-xl font-mono tracking-[0.5em] text-ink caret-botanical placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                    {...codeForm.register("code", {
                      required: true,
                      pattern: /^[0-9]*$/,
                    })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-outline-botanical"
                  disabled={codeForm.formState.isSubmitting}
                >
                  {codeForm.formState.isSubmitting
                    ? "Verifying\u2026"
                    : "Verify"}
                </button>

                {/* Go back if they entered the wrong email */}
                <button
                  type="button"
                  className="label-xs hover:text-botanical transition-colors cursor-pointer"
                  onClick={() => {
                    setStep("email");
                    codeForm.reset();
                    setError("");
                  }}
                >
                  Use a different email
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error */}
        {error && <p className="mt-6 text-sm italic text-alert">{error}</p>}

        {/* Footer quote — rotates daily */}
        <motion.footer
          className="mt-14 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        >
          <div className="w-8 h-px bg-border mb-5" />
          <DailyQuote />
        </motion.footer>
      </motion.div>
    </main>
  );
}
