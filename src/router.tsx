import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/root-layout";
import AuthLayout from "./layouts/auth-layout";
import HouseholdLayout from "./layouts/household-layout";
import Landing from "./pages/landing/page";
import SignIn from "./pages/sign-in/page";
import HouseholdSetup from "./pages/household-setup/page";
import Dashboard from "./pages/dashboard/page";
import PlantBoxPage from "./pages/plant-box/page";
import NotFound from "./pages/not-found/page";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
              { path: "/plant-box/:id", element: <PlantBoxPage /> },
            ],
          },
        ],
      },
      // Catch-all — unmatched paths show the 404 page
      { path: "*", element: <NotFound /> },
    ],
  },
]);
