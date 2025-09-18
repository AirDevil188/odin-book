import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to={"/profile"}>Link</Link>
      <Link to={"/sign-up"}>Sign Up</Link>
    </div>
  );
}
