import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return <h2>Login</h2>;
}
