import { createContext, useContext } from "react";
import { Doc } from "../../convex/_generated/dataModel";

type Household = Doc<"households">;

export const HouseholdContext = createContext<Household | null>(null);

export function useHousehold(): Household {
  const household = useContext(HouseholdContext);
  if (household === null) {
    throw new Error("useHousehold must be used within HouseholdLayout");
  }
  return household;
}
