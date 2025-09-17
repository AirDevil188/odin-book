// App.jsx
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AxiosInterceptor from "./context/AxiosInterceptor";

const queryClient = new QueryClient();

const createRouterWithContext = (auth) => {
  return createRouter({
    routeTree,
    context: {
      auth,
    },
  });
};

const App = () => {
  const auth = useAuth(); // This hook returns the context you want to use.
  const router = createRouterWithContext(auth);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <AuthProvider>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </AuthProvider>
  </StrictMode>,
);
