import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorBoundary from "../components/Error Boundary/ErrorBoundary";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <ErrorBoundary>
          <Outlet />
          <TanStackRouterDevtools />
          <ToastContainer />
        </ErrorBoundary>
      </>
    );
  },
});
