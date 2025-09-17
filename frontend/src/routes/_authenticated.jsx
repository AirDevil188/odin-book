import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "../api/axiosInstance";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { setAuthState, isAuthenticated } = context.auth;

    if (isAuthenticated()) {
      return;
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
      throw redirect({ to: "/sign-in" });
    }
    throw redirect({ to: "/sign-in" });
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
