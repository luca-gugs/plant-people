import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";

export default function HouseholdSetup() {
  const { signOut } = useAuthActions();
  const createHousehold = useMutation(api.households.create);
  const joinHousehold = useMutation(api.households.join);

  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Create a new household — on success, the user doc updates reactively
  // and App.tsx automatically transitions to the dashboard
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createHousehold({ name });
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
      await joinHousehold({ joinCode });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid join code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Set up your household</h1>

      {/* Tab switcher */}
      <div>
        <button onClick={() => { setMode("create"); setError(""); }}>
          Create new
        </button>
        <button onClick={() => { setMode("join"); setError(""); }}>
          Join existing
        </button>
      </div>

      {mode === "create" ? (
        <form onSubmit={handleCreate}>
          <label htmlFor="household-name">Household name</label>
          <input
            id="household-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create household"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoin}>
          <label htmlFor="join-code">Join code</label>
          <input
            id="join-code"
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join household"}
          </button>
        </form>
      )}

      {error && <p>{error}</p>}

      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
}
