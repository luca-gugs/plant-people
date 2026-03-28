import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Components from "./Components";
import HouseholdSetup from "./HouseholdSetup";
import SignIn from "./SignIn";

// Set to true to preview theme components
const SHOW_COMPONENTS = false;

export default function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  // Skip queries when not authenticated
  const user = useQuery(api.users.currentUser, isAuthenticated ? {} : "skip");
  const household = useQuery(api.households.get, isAuthenticated ? {} : "skip");

  const { signOut } = useAuthActions();

  if (SHOW_COMPONENTS) {
    return <Components />;
  }
  // Loading — waiting for auth check
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Not signed in
  if (!isAuthenticated) {
    return <SignIn />;
  }

  // Waiting for user data to load
  if (user === undefined) {
    return <p>Loading...</p>;
  }

  // Signed in but no household yet
  if (!user?.householdId) {
    return <HouseholdSetup />;
  }

  // Waiting for household data to load
  if (household === undefined) {
    return <p>Loading...</p>;
  }

  // Dashboard placeholder — household is set up
  return (
    <div>
      <h1>{household?.name}</h1>
      <p>Share this code to invite others:</p>
      <p>{household?.joinCode}</p>
      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
}
