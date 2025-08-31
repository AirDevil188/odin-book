import { it, describe, expect, vi, afterEach } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { SignupRoute } from "../routes/sign-up.lazy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "../mocks/server";

// Mock useNavigate so we can test for navigation without an actual router
const useNavigateMock = vi.fn();

afterEach(() => {
  server.resetHandlers();
});

// Mock the TanStack Router module to provide our mocked useNavigate hook
vi.mock("@tanstack/react-router", async (importActual) => {
  const originalModule = await importActual();
  return {
    ...originalModule,
    useNavigate: () => useNavigateMock,
  };
});

// Create a new QueryClient instance for each test
const queryClient = new QueryClient();

// Create the root route
const rootRoute = createRootRoute({
  component: Outlet,
});

// Create the signup child route
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignupRoute,
});

// Add signup route to the routeTree
const routeTree = rootRoute.addChildren([signupRoute]);

// Create router with memory history
const router = createRouter({
  routeTree,
  // Start the router at the /sign-up path
  history: createMemoryHistory({ initialEntries: ["/sign-up"] }),
});

// clear useNavigate after each test

afterEach(() => {
  useNavigateMock.mockClear();
});

describe("Signin component", () => {
  it("should successfully create a new user", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    const emailInput = await screen.findByPlaceholderText(/email/i);
    const firstNameInput = await screen.findByPlaceholderText("First Name");
    const lastNameInput = await screen.findByPlaceholderText("Last Name");
    const passwordInput = await screen.findByPlaceholderText("Password");
    const confirmPasswordInput =
      await screen.findByPlaceholderText("Confirm Password");
    const signUpButton = await screen.findByRole("button", {
      name: /sign up/i,
    });

    await user.type(emailInput, "email2@mail.com");
    await user.type(firstNameInput, "Test");
    await user.type(lastNameInput, "Test");
    await user.type(passwordInput, "Test1234!");
    await user.type(confirmPasswordInput, "Test1234!");

    await user.click(signUpButton);

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalledWith({ to: "/" });
    });
  });
  it("should return error 422 because passwords don't match", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    const emailInput = await screen.findByPlaceholderText(/email/i);
    const firstNameInput = await screen.findByPlaceholderText("First Name");
    const lastNameInput = await screen.findByPlaceholderText("Last Name");
    const passwordInput = await screen.findByPlaceholderText("Password");
    const confirmPasswordInput =
      await screen.findByPlaceholderText("Confirm Password");
    const signUpButton = await screen.findByRole("button", {
      name: /sign up/i,
    });

    await user.type(emailInput, "email2@mail.com");
    await user.type(firstNameInput, "Test");
    await user.type(lastNameInput, "Test");
    await user.type(passwordInput, "Test1234!");
    await user.type(confirmPasswordInput, "Test12364!");

    await user.click(signUpButton);

    const confirmPasswordErrorPara = await screen.findByText(
      "Passwords must match.",
    );
    expect(confirmPasswordErrorPara).toBeInTheDocument();
  });
});
