import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar/Navbar";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
