import { useQuery } from "convex/react";
import { Navigate, Outlet } from "react-router";
import { api } from "../../convex/_generated/api";
import { HouseholdContext } from "../contexts/household-context";

export default function HouseholdLayout() {
  const user = useQuery(api.users.currentUser);
  const household = useQuery(api.households.get);

  // Still loading user data
  if (user === undefined) return <p>Loading...</p>;

  // User has no household — redirect to setup
  if (!user?.householdId) return <Navigate to="/setup" replace />;

  // Still loading household data
  if (household === undefined) return <p>Loading...</p>;

  return (
    <HouseholdContext.Provider value={household}>
      <Outlet />
    </HouseholdContext.Provider>
  );
}
