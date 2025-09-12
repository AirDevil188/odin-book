// __root.jsx
import { createRootRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorBoundary from "../components/Error Boundary/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import axios from "../api/axiosInstance";

export const Route = createRootRoute({
  beforeLoad: async ({ context }) => {
    const { setAuthState, authState } = context;
    if (authState.accessToken) {
      return;
    }
    const res = await axios.post("/token/refresh");

    if (res.status === 200) {
      const data = await res.data;
      setAuthState(data);
      return;
    }
    throw redirect({ to: "/sign-in" });
  },
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
