import { it, describe, expect, vi, afterEach } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { SigninRoute } from "../routes/sign-in.lazy";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

const queryClient = new QueryClient();

// mock useNavigate
const useNavigateMock = vi.fn();

// import actual dependency
vi.mock("@tanstack/react-router", async (importActual) => {
  const originalModule = await importActual();
  return {
    ...originalModule,
    useNavigate: () => useNavigateMock,
  };
});

// test router
const rootRoute = createRootRoute({
  component: Outlet,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: SigninRoute,
});

const routeTree = rootRoute.addChildren([loginRoute]);

const router = createRouter({
  routeTree,
  // create memoryHistory so that router starts at the /login path
  history: createMemoryHistory({ initialEntries: ["/login"] }),
});

// clear useNavigate after each test

afterEach(() => {
  useNavigateMock.mockClear();
});

describe("Login route component", () => {
  it("should successfully authenticate the user", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    // login elements

    const emailInput = await screen.findByPlaceholderText(/email/i);
    const passwordInput = await screen.findByPlaceholderText(/password/i);
    const loginButton = await screen.findByRole("button", { name: /sign in/i });
    // input events

    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "Test1234!");
    await user.click(loginButton);

    expect(useNavigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("unsuccessful login wrong credentials", async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    const emailInput = await screen.findByPlaceholderText(/email/i);
    const passwordInput = await screen.findByPlaceholderText(/password/i);
    const loginButton = await screen.findByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "Test124!");
    await user.click(loginButton);

    expect(useNavigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });
});
