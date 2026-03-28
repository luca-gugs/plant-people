import { useAuthActions } from "@convex-dev/auth/react";
import { useHousehold } from "../contexts/household-context";

export default function Dashboard() {
  const household = useHousehold();
  const { signOut } = useAuthActions();

  return (
    <div>
      <h1>{household.name}</h1>
      <p>Share this code to invite others:</p>
      <p>{household.joinCode}</p>
      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
}
