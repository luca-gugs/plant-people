import { useConvexAuth } from "convex/react";
import { Navigate, Outlet } from "react-router";
import NotebookNavigation from "../components/notebook-navigation";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return (
    <>
      <NotebookNavigation />
      <Outlet />
    </>
  );
}
