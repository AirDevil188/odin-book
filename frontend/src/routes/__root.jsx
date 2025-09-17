// __root.jsx
import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorBoundary from "../components/Error Boundary/ErrorBoundary";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <TanStackRouterDevtools />
        <ToastContainer />
      </>
    );
  },
});
