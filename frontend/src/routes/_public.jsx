import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "../api/axiosInstance";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context, location }) => {
    const { setAuthState, isAuthenticated } = context.auth;

    if (location.pathname === "/") {
      throw redirect({ to: "/dashboard" });
    }

    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }

    try {
      const res = await axios.post(
        "/token/refresh",
        {},
        { _intercepted: true },
      );

      if (res.status === 200) {
        const data = await res.data;
        setAuthState(data);
        return;
      }
    } catch (err) {
      return;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
