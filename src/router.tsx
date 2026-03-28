import { createBrowserRouter } from "react-router";
import AuthLayout from "./layouts/auth-layout";
import HouseholdLayout from "./layouts/household-layout";
import Landing from "./pages/landing";
import SignIn from "./pages/sign-in";
import HouseholdSetup from "./pages/household-setup";
import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
  {
    children: [
      // Public routes
      { index: true, element: <Landing /> },
      { path: "/sign-in", element: <SignIn /> },

      // Auth-protected routes
      {
        element: <AuthLayout />,
        children: [
          { path: "/setup", element: <HouseholdSetup /> },

          // Household-required routes
          {
            element: <HouseholdLayout />,
            children: [
              { path: "/dashboard", element: <Dashboard /> },
            ],
          },
        ],
      },
    ],
  },
]);
