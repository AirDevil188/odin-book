import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "../api/axiosInstance";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    const { setAuthState, isAuthenticated } = context.auth;

    if (isAuthenticated()) {
      console.log("public");
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
      console.log(err);
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
