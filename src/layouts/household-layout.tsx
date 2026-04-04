import { useQuery } from "convex/react";
import { Navigate, Outlet } from "react-router";
import { api } from "../../convex/_generated/api";
import { HouseholdContext } from "../contexts/household-context";

export default function HouseholdLayout() {
  const user = useQuery(api.users.currentUser);
  const household = useQuery(api.households.get);

  // Still loading user data
  if (user === undefined)
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Loading...</p>
      </main>
    );

  // User has no household — redirect to setup
  if (!user?.householdId) return <Navigate to="/setup" replace />;

  // Still loading household data
  if (household === undefined)
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Loading...</p>
      </main>
    );

  return (
    <HouseholdContext.Provider value={household}>
      <Outlet />
    </HouseholdContext.Provider>
  );
}
