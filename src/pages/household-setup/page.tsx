import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Plus,
  UserPlus,
  LogOut,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

type Mode = "create" | "join";

export default function HouseholdSetup() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const createHousehold = useMutation(api.households.create);
  const joinHousehold = useMutation(api.households.join);

  const [mode, setMode] = useState<Mode>("create");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function toggleMode(newMode: Mode) {
    setMode(newMode);
    setError("");
    setSuccess(false);
    if (newMode === "create") setJoinCode("");
    else setName("");
  }

  // Create a new household — on success, navigate to the dashboard
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createHousehold({ name, nickname });
      setSuccess(true);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create household",
      );
    } finally {
      setLoading(false);
    }
  }

  // Join an existing household using a 6-character code
  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinHousehold({ joinCode, nickname });
      setSuccess(true);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid join code");
    } finally {
      setLoading(false);
    }
  }

  // Already has a household — skip to dashboard
  if (user?.householdId) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen bg-parchment font-body text-ink flex items-center justify-center p-6 selection:bg-selection">
      {/* Ornamental border inset */}
      <div className="fixed inset-4 pointer-events-none border border-border opacity-40 z-0" />

      <motion.div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ maxWidth: "380px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        {/* ─── Header ─── */}
        <motion.header
          className="text-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="label-wide block mb-4">Household Registry</span>

          {/* Icon flanked by dividers */}
          <div className="flex items-center justify-center mb-5">
            <div className="h-px w-10 bg-border" />
            <div className="mx-4 w-10 h-10 border border-border flex items-center justify-center">
              <Home className="w-5 h-5 text-botanical" />
            </div>
            <div className="h-px w-10 bg-border" />
          </div>

          <h1 className="text-4xl heading-botanical leading-snug">
            Welcome Home
          </h1>
          <p className="mt-3 text-sm text-muted-italic opacity-80">
            Establish or enter your household to begin.
          </p>
        </motion.header>

        {/* ─── Main Card ─── */}
        <motion.div
          className="panel-ornate bg-white/60 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        >
          {/* Nickname — required for both flows */}
          <div className="space-y-2 mb-8">
            <label htmlFor="nickname" className="label-xs block mb-2">
              Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="e.g. Fern"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              disabled={loading || success}
              className="w-full bg-transparent border-b border-border pb-2.5 text-sm italic text-ink caret-botanical placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
            />
            <p className="text-[10px] text-muted-italic">
              How your household will know you.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => toggleMode("create")}
              className={`relative flex-1 pb-3 label-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                mode === "create"
                  ? "text-botanical"
                  : "text-ink-faint hover:text-ink-muted"
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>Create New</span>
              {mode === "create" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-botanical"
                />
              )}
            </button>
            <button
              onClick={() => toggleMode("join")}
              className={`relative flex-1 pb-3 label-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                mode === "join"
                  ? "text-botanical"
                  : "text-ink-faint hover:text-ink-muted"
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Join Existing</span>
              {mode === "join" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-botanical"
                />
              )}
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === "create" ? (
              <motion.form
                key="create"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                onSubmit={(e) => void handleCreate(e)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="household-name"
                    className="label-xs block mb-2"
                  >
                    Household Name
                  </label>
                  <input
                    id="household-name"
                    type="text"
                    placeholder="e.g. Baker Street Suite"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || success}
                    className="w-full bg-transparent border-b border-border pb-2.5 text-sm italic text-ink caret-botanical placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                  />
                  <p className="text-[10px] text-muted-italic">
                    Choose a name your residents will recognise.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !name || !nickname || success}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Household Established</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Establish Household</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="join"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                onSubmit={(e) => void handleJoin(e)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="join-code" className="label-xs block mb-2">
                    Invitation Code
                  </label>
                  <div className="relative">
                    <input
                      id="join-code"
                      type="text"
                      placeholder="ABCDEF"
                      maxLength={6}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      required
                      disabled={loading || success}
                      className="w-full bg-transparent border-b border-border pb-2.5 text-center text-2xl font-mono tracking-[0.5em] text-ink caret-botanical placeholder:text-ink-faint/50 placeholder:tracking-normal focus:outline-none focus:border-botanical transition-colors"
                    />
                    <div className="absolute right-0 bottom-2.5">
                      <Users className="w-4 h-4 text-ink-faint" />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-italic text-center">
                    Enter the 6-character code from your household steward.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || joinCode.length !== 6 || !nickname || success}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Household Entered</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Enter Household</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="border border-alert/30 bg-alert/5 p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
                <p className="text-xs italic text-alert leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Footer ─── */}
        <motion.footer
          className="mt-10 flex flex-col items-center gap-5 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* "or" divider */}
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-border" />
            <span className="label-xs">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sign out link */}
          <button
            onClick={() => void signOut()}
            className="group flex items-center gap-2 label-xs hover:text-botanical transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign out of account</span>
          </button>

          {/* Decorative footer */}
          <div className="flex flex-col items-center gap-3 opacity-30 mt-2">
            <div className="w-8 h-px bg-botanical" />
            <p className="label-xs text-botanical">Secure Environment</p>
            <div className="w-8 h-px bg-botanical" />
          </div>
        </motion.footer>
      </motion.div>
    </main>
  );
}
